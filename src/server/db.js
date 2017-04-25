import * as Promise   from "bluebird"
import * as R         from "ramda"
import * as S         from "schemation"
import * as fs        from "fs"
import pg             from "pg"
import {patch}        from "node-postgres-named"

//

const pry = (context, fn) => Promise.promisify(fn, {context})
const prn = (context, fn) => Promise.promisify(fn, {multiArgs: true, context})

const readFile = (...args) => pry(fs, fs.readFile)(...args).then(data => data.toString())

const pool =
  process.env.DATABASE_URL
  ? new pg.Pool({connectionString: process.env.DATABASE_URL})
  : console.log("DATABASE_URL env var not defined.  DB ops will be silently ignored.")

const mkExec = sqlTemplatePromise => args =>
  sqlTemplatePromise.then(sqlTemplate =>
  sqlTemplate
  ? prn(pool, pool.connect)().then(([clientIn, done]) => {
      const client = patch(clientIn)
      const loop = i => result => {
        if (i < sqlTemplate.length) {
          return pry(client, client.query)(sqlTemplate[i], args).then(loop(i+1))
        } else {
          done()
          return result
        }
      }
      return loop(0)({rows: []})
    })
  : Promise.resolve([]))

const parseTemplate = R.pipe(
  R.split(";"),
  R.map(R.trim),
  R.filter(R.complement(R.equals(""))),
  R.map(statement => {
    const file = /^CALL +'([^']+)'$/.exec(statement)
    return file ? readTemplate(file[1]) : Promise.resolve([statement])
  }),
  Promise.all,
  p => p.then(R.chain(R.identity)))

const readTemplate = file =>
  readFile(file).then(parseTemplate)

//

function format(v) {
  switch (typeof v) {
    case "string":
    case "number":
      return v
    default:
      return JSON.stringify(v)
  }
}

function toJSON(data) {
  if (data instanceof Date)
    return data.toISOString()
  else if (data instanceof Object)
    return R.map(toJSON, data)
  else
    return data
}

const pipeInProd = process.env.NODE_ENV === "production" ? R.identity : R.pipe

//

export function row0(result) {
  const rows = result.rows
  if (rows.length !== 1)
    return null
  return toJSON(rows[0])
}
export const rows = pipeInProd(result => result.rows, toJSON)
export const rowCount = result => ({rowCount: result.rowCount || 0})

export const mkQuery = ({sql, inn, out, parse}) => {
  const template = pool ? parseTemplate(sql) : Promise.resolve(undefined)
  const exec = mkExec(template)
  const method = i =>
    exec(R.map(format, i)).then(pipeInProd(parse, S.validate(out)))
  method.inn = inn
  method.out = out
  return method
}

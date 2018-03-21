import * as L from 'partial.lenses'
import * as Promise from 'bluebird'
import * as R from 'ramda'
import * as V from 'partial.lenses.validation'
import * as fs from 'fs'
import pg from 'pg'
import {patch} from 'node-postgres-named'

//

const pry = (context, fn) => Promise.promisify(fn, {context})
const prn = (context, fn) => Promise.promisify(fn, {multiArgs: true, context})

const readFile = (...args) =>
  pry(fs, fs.readFile)(...args).then(data => data.toString())

const pool = process.env.DATABASE_URL
  ? new pg.Pool({connectionString: process.env.DATABASE_URL})
  : console.log(
      'DATABASE_URL env var not defined.  DB ops will be silently ignored.'
    )

const mkExec = sqlTemplatePromise => args =>
  sqlTemplatePromise.then(
    sqlTemplate =>
      sqlTemplate
        ? prn(pool, pool.connect)().then(([clientIn, done]) => {
            const client = patch(clientIn)
            const results = []
            const loop = i => result => {
              if (void 0 !== result) results.push(result)
              if (i < sqlTemplate.length) {
                return pry(client, client.query)(sqlTemplate[i], args).then(
                  loop(i + 1)
                )
              } else {
                done()
                return results
              }
            }
            return loop(0)(undefined)
          })
        : Promise.resolve([])
  )

const parseTemplate = /*#__PURE__*/ R.pipe(
  R.split(';'),
  R.map(R.trim),
  R.filter(R.complement(R.equals(''))),
  R.map(statement => {
    const file = /^CALL +'([^']+)'$/.exec(statement)
    return file ? readTemplate(file[1]) : Promise.resolve([statement])
  }),
  Promise.all,
  p => p.then(R.chain(R.identity))
)

const readTemplate = file => readFile(file).then(parseTemplate)

//

function format(v) {
  switch (typeof v) {
    case 'string':
    case 'number':
      return v
    default:
      return JSON.stringify(v)
  }
}

export function toJSON(data) {
  if (data instanceof Date) return data.toISOString()
  else if (data instanceof Object) return R.map(toJSON, data)
  else return data
}

const pipeInProd = process.env.NODE_ENV === 'production' ? R.identity : R.pipe

//

export function row0(results) {
  const rows = L.get([L.last, 'rows'], results)
  return L.get('length', rows) !== 1 ? null : toJSON(rows[0])
}
export const rows = /*#__PURE__*/ pipeInProd(L.get([L.last, 'rows']), toJSON)
export const rowCount = results => ({
  rowCount: L.get([L.last, 'rowCount'], results) || 0
})

export const mkQuery = ({sql, inn, out, parse}) => {
  const template = pool ? parseTemplate(sql) : Promise.resolve(undefined)
  const exec = mkExec(template)
  const method = inn =>
    exec(R.map(format, inn)).then(
      pipeInProd(results => parse(results, inn), V.validate(out))
    )
  method.inn = inn
  method.out = out
  return method
}

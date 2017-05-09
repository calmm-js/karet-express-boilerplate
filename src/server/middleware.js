import * as S from "schemation"

import * as Db from "./db"

//

export const jsonAPI = (schema, fn) => (req, res) => {
  const params = {...req.query, ...req.body, ...req.params}
  async function onMatch(args) {
    let json
    try {
      json = await fn(args)
    } catch (error) {
      res.status(503)
      json = {error: `${error}`}
    }
    res.json(json)
  }
  S.tryMatch(schema, onMatch, mismatch => {
    res.status(400)
    res.type("text/plain")
    return res.send(`Invalid or missing parameters: ${mismatch}`)
  })(params)
}

export const dbAPI = op => jsonAPI(op.inn, Db.mkQuery(op))

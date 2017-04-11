import * as S from "schemation"

//

export const jsonAPI = ({prop, msg}, schema, fn) => (req, res) => {
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
    return res.send(`${msg}: ${mismatch}`)
  })(req[prop])
}

export const query = {prop: "query", msg: "Invalid or missing query parameter"}
export const body = {prop: "body", msg: "Invalid body"}

export const dbAPI = (kind, op) => jsonAPI(kind, op.inn, op)

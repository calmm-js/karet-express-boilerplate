import * as V from 'partial.lenses.validation'

import * as Db from './db'

//

export const jsonAPI = (schema, fn) => (req, res) =>
  V.run(
    {
      onAccept: async args => {
        let json
        try {
          json = await fn(args)
        } catch (error) {
          res.status(503)
          json = {error: `${error}`}
        }
        res.json(json)
      },
      onReject: mismatch => {
        res.status(400)
        res.type('text/plain')
        return res.send(
          `Invalid or missing parameters: ${JSON.stringify(mismatch, null, 2)}`
        )
      }
    },
    schema,
    {...req.query, ...req.body, ...req.params}
  )

export const dbAPI = op => jsonAPI(op.inn, Db.mkQuery(op))

import * as R from 'ramda'
import express from 'express'

import * as MW from '../../../server/middleware'
import * as Db from '../../../server/db'

import * as V from '../../../shared/schema'

//

const id = V.nonNegDec

const contact = R.is(Object)

const form_row = V.keep(
  'id',
  V.props({id, contact, created: V.created, modified: V.modified})
)

//

export const router = express.Router()

router.get(
  '/contacts/data',
  MW.dbAPI({
    sql: `SELECT COUNT(*) as total
          FROM contacts ;
          SELECT *
          FROM contacts
          ORDER BY id
          OFFSET $offset
           LIMIT $limit ;`,
    inn: V.windowMax(100),
    out: V.nullable(
      V.props({
        total: R.is(Number),
        offset: R.is(Number),
        data: V.arrayId(form_row)
      })
    ),
    parse: ([count, data], {offset}) =>
      !count
        ? null
        : {
            total: parseInt(count.rows[0].total, 10),
            offset: parseInt(offset, 10),
            data: Db.toJSON(data.rows)
          }
  })
)

router.post(
  '/contacts/data',
  MW.dbAPI({
    sql: `INSERT
          INTO contacts (  contact, created, modified )
          VALUES        ( $contact,   now(),    now() )
          RETURNING * ;`,
    inn: V.props({contact}),
    out: V.nullable(form_row),
    parse: Db.row0
  })
)

router.get(
  '/contacts/data/:id',
  MW.dbAPI({
    sql: `SELECT * FROM contacts WHERE id = $id ;`,
    inn: V.props({id}),
    out: V.nullable(form_row),
    parse: Db.row0
  })
)

router.put(
  '/contacts/data/:id',
  MW.dbAPI({
    sql: `UPDATE contacts
          SET contact = $contact, modified = now()
          WHERE id = $id
          RETURNING * ;`,
    inn: V.props({
      id,
      contact,
      created: V.optional(V.created),
      modified: V.optional(V.modified)
    }),
    out: V.nullable(form_row),
    parse: Db.row0
  })
)

router.delete(
  '/contacts/data/:id',
  MW.dbAPI({
    sql: `DELETE FROM contacts WHERE id = $id ;`,
    inn: V.props({id}),
    out: V.nullable(V.props({id})),
    parse: (results, {id}) => (Db.rowCount(results) ? {id} : null)
  })
)

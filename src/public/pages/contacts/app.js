import * as MW from "../../../server/middleware"
import * as Db from "../../../server/db"

import * as S from "../../../shared/schema"

//

const id = S.nonNegDec

const contact = {}

const form_row = {id, contact, created: S.created, modified: S.modified}

//

export default app => {
  app.get("/contacts/data", MW.dbAPI({
    sql: `SELECT COUNT(*) as total
          FROM contacts ;
          SELECT *
          FROM contacts
          ORDER BY id
          OFFSET $offset
           LIMIT $limit ;`,
    inn: S.windowMax(100),
    out: S.nullable({total: S.number,
                     offset: S.number,
                     data: [form_row]}),
    parse: ([count, data], {offset}) => !count
      ? null
      : {total: parseInt(count.rows[0].total, 10),
         offset: parseInt(offset, 10),
         data: Db.toJSON(data.rows)}
  }))

  app.post("/contacts/data", MW.dbAPI({
    sql: `INSERT
          INTO contacts (  contact, created, modified )
          VALUES        ( $contact,   now(),    now() )
          RETURNING * ;`,
    inn: {contact},
    out: S.nullable(form_row),
    parse: Db.row0
  }))

  app.get("/contacts/data/:id", MW.dbAPI({
    sql: `SELECT * FROM contacts WHERE id = $id ;`,
    inn: {id},
    out: S.nullable(form_row),
    parse: Db.row0
  }))

  app.put("/contacts/data/:id", MW.dbAPI({
    sql: `UPDATE contacts
          SET contact = $contact, modified = now()
          WHERE id = $id
          RETURNING * ;`,
    inn: {id, contact},
    out: S.nullable(form_row),
    parse: Db.row0
  }))

  app.delete("/contacts/data/:id", MW.dbAPI({
    sql: `DELETE FROM contacts WHERE id = $id ;`,
    inn: {id},
    out: S.nullable({id}),
    parse: (results, {id}) => Db.rowCount(results) ? {id} : null
  }))
}

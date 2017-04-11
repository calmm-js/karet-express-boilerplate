import * as Db from "../../../server/db"

import * as S from "../../../shared/schema"

//

const id = S.nonNegDec

const answers = S.any

const form_row = {id, answers, created: S.created}

//

export const insert = Db.mkQuery({
  sql: "CALL 'src/public/pages/form/insert-form.sql'",
  inn: {answers},
  out: S.rowCount,
  parse: Db.rowCount
})

export const select = Db.mkQuery({
  sql: "CALL 'src/public/pages/form/select-form.sql'",
  inn: S.windowMax(100),
  out: [form_row],
  parse: Db.rows
})

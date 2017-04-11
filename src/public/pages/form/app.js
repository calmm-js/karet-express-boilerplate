import * as MW from "../../../server/middleware"

import * as Db from "./db"

export default app => {
  app.post("/form-data", MW.dbAPI(MW.body, Db.insert))
  app.get("/form-data", MW.dbAPI(MW.query, Db.select))
}

import * as React from "karet"
import * as U     from "karet.util"

import Link from "../components/link"

export default U.withContext((_, {params}) =>
  <div>
    <h1>Another page</h1>
    <div>{U.lift(x => JSON.stringify(x))(params)}</div>
    <Link href="/another-page?hello=world">Hello!</Link>
  </div>)

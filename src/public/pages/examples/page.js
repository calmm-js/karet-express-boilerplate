import * as React from "karet"
import * as U     from "karet.util"

import { PathParams } from "./path-params"
import { QuerystringParams } from "./querystring-params"

export default U.withContext(
  ( props, { params, path } ) =>
    <div>
      <h1>Examples</h1>
      <div>
        Routing / Path Params:
        <PathParams path={ path } props={ props }/>
      </div>
      <div>
        Querystring Params:
        <QuerystringParams path={ path } params={ params }/>
      </div>
    </div>
)

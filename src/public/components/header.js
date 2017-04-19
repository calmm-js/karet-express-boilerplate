import * as U from "karet.util"
import React  from "karet"

import Link from "./link"

export default ({visible = U.atom(true)}) =>
  <div className="header"
       onClick={e => visible.set(true) || e.stopPropagation()}>
    <div className={U.cns("content", U.ifte(visible, "visible", "hidden"))}
         onClick={e => visible.set(false) || e.stopPropagation()}>
      <div className="links">
        <Link href="/">Main</Link>
        <Link href="/another-page">Another page</Link>
        <Link href="/form">Form</Link>
        <Link href="/main/1234">Main with ID</Link>
      </div>
    </div>
  </div>

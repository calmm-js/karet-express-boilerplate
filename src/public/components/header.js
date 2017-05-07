import * as React from "karet"

import Link from "./link"

export default () =>
  <div className="header">
    <div className="content">
      <div className="links">
        <Link href="/">Main</Link>
        <Link href="/examples/keep/calmm/and/curry/on/?hello=world">Examples</Link>
        <Link href="/contacts">Contacts</Link>
        <Link href="/form">Form</Link>
      </div>
    </div>
  </div>

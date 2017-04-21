import React  from "karet"

import Link from "./link"

export default () =>
  <div className="header">
    <div className="content">
      <div className="links">
        <Link href="/">Main</Link>
        <Link href="/another-page">Another page</Link>
        <Link href="/form">Form</Link>
        <Link href="/main/1234">Main with ID</Link>
        <Link href="/meiosis">Meiosis</Link>
        <Link href="/company">Company</Link>
      </div>
    </div>
  </div>

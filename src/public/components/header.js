import * as React from 'karet'

import Link from './link'

export default () => (
  <div className="header">
    <div className="content">
      <div className="links">
        <Link href="/">Main</Link>
        <Link href="/another-page">Another page</Link>
        <Link href="/examples/keep/calmm/and/curry/on/?hello=world">
          Examples
        </Link>
        <Link href="/contacts">Contacts</Link>
      </div>
    </div>
  </div>
)

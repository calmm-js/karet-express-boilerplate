import * as L from 'partial.lenses'
import * as React from 'karet'
import * as U from 'karet.util'

import {Link} from './link'

export const Header = U.withContext((_, {routes}) => (
  <div className="header">
    <div className="content">
      <div className="links">
        {L.collectAs(
          ({name, href, pattern}, i) => (
            <Link key={i} href={href || pattern}>
              {name}
            </Link>
          ),
          L.flat(L.when(L.get('name'))),
          routes
        )}
      </div>
    </div>
  </div>
))

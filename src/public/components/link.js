import * as L from 'kefir.partial.lenses'
import * as R from 'kefir.ramda'
import * as React from 'karet'
import * as U from 'karet.util'

import {disassemble} from '../../shared/routing'
import {parse} from '../../shared/search-params'

import {scroll} from '../../client/scroll'

const isExt = R.test(/^https?:\/\//)

const dropHash = U.lift(href => /^([^#]*)/.exec(href)[1])

const hrefParse = U.lift(href =>
  /^((\/[^?#]*)([?][^#]*)?)?([#].*)?$/.exec(href)
)

const hrefLocation = R.pipe(
  hrefParse,
  L.get(
    L.ifElse(
      Array.isArray,
      L.pick({
        path: [2, L.valueOr('/')],
        params: [3, parse],
        hash: [4, L.valueOr('')]
      }),
      []
    )
  )
)

export const Link = U.withContext(
  (
    {href, onClick: outerOnClick, onThere, mount, className, ...props},
    {location, locationPrime, routes, route}
  ) => {
    const onClick = U.lift(href => e => {
      const internal = hrefParse(href)

      if (internal) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
        e.preventDefault()

        const [, , path = '', search = '', hash = ''] = internal

        location.set({path, search, hash})

        if (!path && !search) {
          window.setTimeout(() => scroll(hash, 200, onThere), 10)
        } else {
          if (!hash) scroll(0, 1, onThere)
          else window.setTimeout(() => scroll(hash, onThere), 100)
        }
      }
    })

    const thisRoute = L.get('route', disassemble(routes, dropHash(href)))
    const sameRoute = R.equals(thisRoute, route)

    const thisLocation = hrefLocation(href)
    const sameLocation = R.equals(thisLocation, locationPrime)

    return (
      <a
        href={href}
        ref={mount}
        onClick={U.actions(outerOnClick, onClick(href))}
        className={U.cns(
          className,
          U.when(isExt(href), 'ext-link'),
          U.when(sameRoute, 'same-route'),
          U.when(sameLocation, 'same-location')
        )}
        {...props}
      />
    )
  }
)

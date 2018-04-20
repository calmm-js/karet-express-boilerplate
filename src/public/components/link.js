import * as R from 'kefir.ramda'
import * as React from 'karet'
import * as U from 'karet.util'

import scroll from '../../client/scroll'

function special(e) {
  e.preventDefault()
  e.stopPropagation()
}

let onsite

const isExt = R.test(/^https?:\/\//)

export const Link = U.withContext(
  (
    {href, onClick: outerOnClick, onThere, mount, className, ...props},
    {location}
  ) => {
    const onClick = U.liftRec(href => e => {
      const internal = /^((\/[^?#]*)([?][^#]*)?)?([#].*)?$/.exec(href)

      if (internal) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return

        const [, , path = '', search = '', hash = ''] = internal

        if (!path && !search) {
          if (!hash && onsite) {
            special(e)
            window.history.back()
          } else {
            window.setTimeout(() => scroll(hash, 200, onThere), 10)
          }
        } else {
          special(e)
          location.set({path, search, hash})

          if (!hash) scroll(0, 1, onThere)
          else window.setTimeout(() => scroll(hash, onThere), 100)
        }
      }
      onsite = 1
    })

    return (
      <a
        href={href}
        ref={mount}
        onClick={U.actions(outerOnClick, onClick(href))}
        className={U.cns(className, U.when(isExt(href), 'ext-link'))}
        {...props}
      />
    )
  }
)

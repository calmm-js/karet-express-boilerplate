import * as R from "ramda"
import * as U from "karet.util"

let unique = 0
const next = () => ++unique

const fromWindow = typeof window === "undefined"
  ? () => U.never
  : event => U.fromEvents(window, event, next).toProperty(next)

export const scroll = fromWindow("scroll")
export const touchmove = fromWindow("touchmove")
export const popstate = fromWindow("popstate")
export const resize = fromWindow("resize")
export const orientationchange = fromWindow("orientationchange")

export const dimensions = U.parallel([resize, orientationchange])

//

function getLocation() {
  const l = window.location
  return {path: l.pathname, search: l.search, hash: l.hash}
}

export const location = U.atom(getLocation())

popstate.onValue(() => location.set(getLocation()))

location.onValue(next => {
  if (!R.equals(getLocation(), next))
    window.history.pushState(null, "", `${next.path}${next.search}${next.hash}`)
})

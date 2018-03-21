import * as R from 'ramda'
import * as U from 'karet.util'

let unique = 0
const next = () => ++unique

const isServer = typeof window === 'undefined'

const fromWindow = isServer
  ? () => U.never
  : event => U.fromEvents(window, event, next).toProperty(next)

export const scroll = /*#__PURE__*/ fromWindow('scroll')
export const touchmove = /*#__PURE__*/ fromWindow('touchmove')
export const popstate = /*#__PURE__*/ fromWindow('popstate')
export const resize = /*#__PURE__*/ fromWindow('resize')
export const orientationchange = /*#__PURE__*/ fromWindow('orientationchange')

export const dimensions = /*#__PURE__*/ U.parallel([resize, orientationchange])

//

function getLocation() {
  const l = isServer ? {} : window.location
  return {path: l.pathname, search: l.search, hash: l.hash}
}

export const location = U.atom(getLocation())

popstate.onValue(() => location.set(getLocation()))

location.onValue(next => {
  if (!R.equals(getLocation(), next))
    window.history.pushState(null, '', `${next.path}${next.search}${next.hash}`)
})

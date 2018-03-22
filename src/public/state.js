import * as U from 'karet.util'

import {paramsI} from '../shared/search-params'
import {routingI} from '../shared/routing'

import * as Meta from './meta'

// NOTE: Only state here that must be sent from server to client as a JSON blob.
export const initial = {
  // State
}

const searchParamsL = ['search', paramsI]

export const context = (location, host, state, routes) => {
  const path = U.view('path', location)
  const params = U.view(searchParamsL, location)
  const hash = U.view('hash', location)
  const resolved = U.view(routingI(routes), path)
  return {
    location,
    locationPrime: U.molecule({path, params, hash}),
    hash,
    host,
    params,
    path,
    state,
    meta: Meta.get(location, host),
    routes,
    resolved,
    route: U.view('route', resolved),
    matches: U.view('match', resolved)
  }
}

import * as R from 'ramda'
import * as React from 'karet'
import * as U from 'karet.util'
import toRegex from 'path-to-regexp'

// TODO: Make it possible to add routes more than once?

// begin routes initialization
const expandRoutes = R.pipe(R.toPairs, R.map(R.zipObj(['route', 'Component'])))

const addRegexes = R.map(entry => {
  const keys = []
  const regex = toRegex(entry.route, keys)
  regex.keys = keys.map(R.prop('name'))
  return {...entry, regex}
})

const sortStaticFirst = R.sortBy(({regex}) => (regex.keys.length === 0 ? 0 : 1))

const prepareRoutes = R.pipe(expandRoutes, addRegexes, sortStaticFirst)
// end routes initialization

// route resolution
const router = U.lift((routes, NotFound, path) => {
  for (let i = 0; i < routes.length; ++i) {
    const {Component, regex} = routes[i]
    const match = regex.exec(path)
    if (match) return <Component {...R.zipObj(regex.keys, R.tail(match))} />
  }
  return <NotFound />
})

export const Router = U.withContext(({routes, NotFound}, {path}) =>
  U.fromKefir(router(prepareRoutes(routes), NotFound, path))
)

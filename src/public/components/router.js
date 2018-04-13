import * as L from 'kefir.partial.lenses'
import * as R from 'kefir.ramda'
import * as React from 'karet'
import * as U from 'karet.util'
import toRegex from 'path-to-regexp'

const expandRoutes = L.collectAs((Component, route) => {
  const params = []
  const regex = toRegex(route, params)
  return {
    route,
    regex,
    keys: ['path'].concat(params.map(L.get('name'))),
    Component
  }
}, L.values)

const sortStaticFirst = R.sortBy(({keys}) => (keys.length === 1 ? 0 : 1))

const prepareRoutes = R.o(sortStaticFirst, expandRoutes)

const router = U.lift((routes, NotFound, path) => {
  for (let i = 0; i < routes.length; ++i) {
    const {Component, keys, regex} = routes[i]
    const match = regex.exec(path)
    if (match) return <Component {...R.zipObj(keys, match)} />
  }
  return <NotFound />
})

export const Router = U.withContext(({routes, NotFound}, {path}) => (
  <React.Fragment>
    {router(prepareRoutes(routes), NotFound, path)}
  </React.Fragment>
))

import K, * as U from "karet.util"
import React     from "karet"

export default U.withContext(({routes, NotFound}, {path}) => U.fromKefir(K(path, path =>
  React.createElement(routes[path] || NotFound)
)))

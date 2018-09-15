import * as I from 'infestines'
import * as L from 'partial.lenses'
import * as U from 'karet.util'
import p2re from 'path-to-regexp'

export const prepare = L.collectAs((target, pattern) => {
  const {Component, ...props} = I.isFunction(target)
    ? {Component: target}
    : target
  const formals = []
  const regexp = p2re(pattern, formals)
  return {...props, pattern, regexp, formals, Component}
}, L.values)

export const disassemble = U.lift(routes => path => {
  for (let i = 0, n = routes.length; i < n; ++i) {
    const route = routes[i]
    const matches = route.regexp.exec(path)
    if (null !== matches) {
      const match = {}
      const {formals} = route
      for (let i = 0, n = formals.length; i < n; ++i) {
        // XXX Handle optional and repeat parameters?
        const {name} = formals[i]
        const value = matches[i + 1]
        match[name] = undefined === value ? value : decodeURIComponent(value)
      }
      return {route, match}
    }
  }
})

export const assemble = ({route: {pattern}, match}) =>
  p2re.compile(pattern)(match)

export const routingI = routes => L.iso(disassemble(routes), assemble)

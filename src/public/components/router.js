import * as React from 'karet'
import * as U from 'karet.util'

export const Router = U.withContext(
  ({NotFound}, {resolved, matches, params, path}) => {
    const notFound = {route: {Component: NotFound}, match: {}}

    let last, args, rendered

    const render = U.lift(resolved => {
      const {route, match} = resolved || notFound
      if (route !== last) {
        last = route
        for (const k in args) args[k]._onDeactivation()
        args = {}
        for (const k in match) args[k] = U.view(k, matches)
        const {Component} = route
        rendered = <Component {...{params, path}} {...args} />
      }
      return rendered
    })

    return <React.Fragment>{render(resolved)}</React.Fragment>
  }
)

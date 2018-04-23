import * as L from 'partial.lenses'
import * as U from 'karet.util'

const vars = [
  /* e.g. "GA" */
]

export default /*#__PURE__*/ U.thru(
  typeof window === 'undefined'
    ? process.env
    : JSON.parse(document.getElementById('env-data').getAttribute('data-env')),
  L.get([L.props(...vars), L.defaults({})])
)

import * as L from 'kefir.partial.lenses'
import * as R from 'kefir.ramda'
import * as React from 'karet'
import * as U from 'karet.util'

import {Link} from '../../components/link'

import {PrettyStringify} from '../../components/pretty-stringify'

const addQuerystringParams = params => params.modify(R.append(['', '']))

const QuerystringParam = ({param}) => (
  <tr>
    <td>
      <U.Input value={U.view(0, param)} />
    </td>
    <td>
      <U.Input value={U.view(1, param)} />
    </td>
    <td>
      <button onClick={() => param.remove()}>Remove</button>
    </td>
  </tr>
)

const makeQuerystring = R.ifElse(
  R.equals([]),
  R.always(''),
  R.pipe(
    R.map(R.pipe(R.map(encodeURIComponent), R.join('='))),
    R.join('&'),
    R.concat('?')
  )
)

const pairsI = L.iso(R.toPairs, R.fromPairs)

const newPathString = (path, params) =>
  U.string`${path}${makeQuerystring(params)}`

export const QuerystringParams = ({params, path, copy = U.atom()}) => {
  const copied = U.view([L.defaults(params), pairsI], copy)
  const href = newPathString(path, copied)
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Key</td>
            <td>Value</td>
            <td>
              <button onClick={() => addQuerystringParams(copied)}>Add</button>
            </td>
          </tr>
        </thead>
        <tbody>
          {U.mapElems(
            (param, i) => <QuerystringParam key={i} param={param} />,
            copied
          )}
        </tbody>
      </table>
      Navigate to: <Link href={href}>{href}</Link>
      <PrettyStringify value={params} />
    </div>
  )
}

import * as L from 'kefir.partial.lenses'
import * as R from 'kefir.ramda'
import * as React from 'karet'
import * as U from 'karet.util'

import {PathInput} from '../../components/restricted-input'
import {PrettyStringify} from '../../components/pretty-stringify'

const getPagePathRoot = R.pipe(x => R.match(/(^\/[^/]+\/?).*/, x)[1])

const subPathGetter = pagePathRoot =>
  R.pipe(R.replace(pagePathRoot, ''), decodeURIComponent)

const subPathSetter = pagePathRoot =>
  R.pipe(
    R.map(R.when(x => x !== '/', encodeURIComponent)),
    R.join(''),
    R.concat(pagePathRoot),
    R.replace(pagePathRoot + '/', pagePathRoot)
  )

const subPathL = pagePathRoot =>
  L.iso(subPathGetter(pagePathRoot), subPathSetter(pagePathRoot))

const decodeProps = R.mapObjIndexed(decodeURIComponent)

export const PathParams = ({props, path}) => (
  <div>
    <PathInput
      type="text"
      label="Path"
      value={U.view(subPathL(getPagePathRoot(path)), path)}
    />
    <PrettyStringify value={decodeProps(props)} />
  </div>
)

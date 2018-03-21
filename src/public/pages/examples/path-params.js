import * as L from 'partial.lenses'
import * as React from 'karet'
import * as U from 'karet.util'

import {PathInput} from '../../components/restricted-input'
import PrettyStringify from '../../components/pretty-stringify'

const getPagePathRoot = U.pipe(x => U.match(/(^\/[^/]+\/?).*/, x)[1])

const subPathGetter = pagePathRoot =>
  U.pipe(U.replace(pagePathRoot, ''), decodeURIComponent)

const subPathSetter = pagePathRoot =>
  U.pipe(
    U.map(U.when(x => x !== '/', encodeURIComponent)),
    U.join(''),
    U.concat(pagePathRoot),
    U.replace(pagePathRoot + '/', pagePathRoot)
  )

const subPathL = U.lift(pagePathRoot =>
  L.iso(subPathGetter(pagePathRoot), subPathSetter(pagePathRoot))
)

const decodeProps = U.mapObjIndexed(decodeURIComponent)

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

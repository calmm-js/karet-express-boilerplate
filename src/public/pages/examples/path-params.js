import K, * as U from "karet.util"
import * as L    from "partial.lenses"
import React     from "karet"

import { PathInput }       from "../../components/restricted-input"
import { PrettyStringify } from "../../components/pretty-stringify"

const getPagePathRoot =
  U.pipe( x => U.match( /(^\/[^/]+\/?).*/, x )[ 1 ] )

const subPathGetter = pagePathRoot =>
  U.pipe( U.replace( pagePathRoot, '' )
                   , decodeURIComponent
                   )

const subPathSetter = pagePathRoot =>
  U.pipe( U.map( U.when( x => x !== '/'
                       , encodeURIComponent
                       )
               )
        , U.join( '' )
        , U.concat( pagePathRoot )
        , U.replace( pagePathRoot + '/', pagePathRoot )
        )

const _subPathL = pagePathRoot =>
  L.iso( subPathGetter( pagePathRoot )
       , subPathSetter( pagePathRoot )
       )
const subPathL = U.lift( _subPathL )

const decodeProps =
  U.mapObjIndexed( decodeURIComponent )

export const PathParams = ( { props, path } ) =>
  <div>
    <PathInput
      type="text"
      label="Path"
      value={ U.view( subPathL( getPagePathRoot( path ) ), path ) }/>
    <PrettyStringify space="2" obj={ decodeProps( props ) } />
  </div>

import K, * as U from "karet.util"
import * as L    from "partial.lenses"
import React     from "karet"

import { PathInput }       from "../../components/restricted-input"
import { PrettyStringify } from "../../components/pretty-stringify"

const getPagePathRoot =
  U.pipe( x => U.match( /(^\/[^/]+\/).*/, x )[ 1 ] )

const _subPathL = pagePathRoot =>
  L.iso( U.pipe( U.replace( pagePathRoot, '' )
               , decodeURIComponent
               )
       , U.pipe( U.map( U.when( x => x !== '/'
                              , encodeURIComponent
                              )
                      )
               , U.join( '' )
               , U.concat( pagePathRoot )
               )
       )
const subPathL = U.lift( _subPathL )

export const PathParams = ( { props, path } ) =>
  <div>
    <PathInput
      type="text"
      label="Path"
      value={ U.view( subPathL( getPagePathRoot( path ) ), path ) }/>
    { PrettyStringify( 2 )( props ) }
  </div>

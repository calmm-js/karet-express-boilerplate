import K, * as U from "karet.util"
import * as L    from "partial.lenses"
import React     from "karet"

import Link from "../../components/link"

import { TextInput }       from "../../components/text-input"
import { PrettyStringify } from "../../components/pretty-stringify"

const addQuerystringParams = params =>
  params.modify( U.append( [ '', '' ]  ) )

const QuerystringParam = ( { param } ) =>
{ param.log( 'param' )
  return <tr>
    <td><TextInput value={ U.view( [ 0 ], param ) }/></td>
    <td><TextInput value={ U.view( [ 1 ], param ) }/></td>
    <td><button onClick={ () => param.remove() }>Remove</button></td>
  </tr>
}

export const QuerystringParams = ( { params, path, copy = U.atom( [] ) } ) =>
{ const paramsPairs = U.view( L.iso( U.toPairs, U.fromPairs ), params )
  return <div>
    <table>
      { U.set( copy, paramsPairs ) }
      <thead>
        <tr>
          <td>Key</td>
          <td>Value</td>
          <td>
            <button onClick={ () => addQuerystringParams( copy ) }>Add</button>
          </td>
        </tr>
      </thead>
      <tbody>
        { U.mapElems( ( param, i ) =>
                        <QuerystringParam key={ i } param={ param }/>
                    )( copy )
        }
      </tbody>
    </table>
    { PrettyStringify( 2 )( params ) }
    Navigate to:&nbsp;
    <Link href={ U.string`${ path }?hello=everybody` }>
      { U.string`${ path }?hello=everybody` }
    </Link>
  </div>
}
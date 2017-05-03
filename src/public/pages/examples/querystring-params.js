import * as L     from "partial.lenses"
import * as React from "karet"
import K, * as U  from "karet.util"

import Link from "../../components/link"

import TextInput       from "../../components/text-input"
import PrettyStringify from "../../components/pretty-stringify"

const addQuerystringParams = params =>
  params.modify( U.append( [ '', '' ]  ) )

const QuerystringParam = ( { param } ) =>
  <tr>
    <td><TextInput value={ U.view( 0, param ) }/></td>
    <td><TextInput value={ U.view( 1, param ) }/></td>
    <td><button onClick={ () => param.remove() }>Remove</button></td>
  </tr>

const makeQuerystring =
  U.ifElse( U.equals( [] )
          , _ => ''
          , U.pipe( U.map( U.pipe( U.map( encodeURIComponent )
                                 , U.join( '=' )
                                 )
                         )
                  , U.join( '&' )
                  , U.concat( '?' )
                  )
          )

const toFromPairsL = L.iso( U.toPairs, U.fromPairs )

const newPathString = ( path, params ) =>
  U.string`${ path }${ makeQuerystring( params ) }`

export const QuerystringParams = ( { params, path, copy = U.atom() } ) =>
{ const copied =
    U.view( K( params
             , params =>
               [ L.defaults( params ), toFromPairsL, L.define( [] ) ]
             )
          , copy
          )
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Key</td>
            <td>Value</td>
            <td>
              <button onClick={ () => addQuerystringParams( copied ) }>Add</button>
            </td>
          </tr>
        </thead>
        <tbody>
          { U.mapElems( ( param, i ) =>
                          <QuerystringParam key={ i } param={ param }/>
                        , copied
                      )
          }
        </tbody>
      </table>
      Navigate to:&nbsp;
      { U.scope( ( href = newPathString( path, copied ) ) =>
                   <Link href={ href }>{ href }</Link>
               )
      }
      <PrettyStringify value={ params } />
    </div>
  )
}

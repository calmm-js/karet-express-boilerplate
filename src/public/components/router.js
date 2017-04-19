import * as R     from "ramda"
import * as L     from "partial.lenses"
import K, * as U  from "karet.util"
import React      from "karet"
import toRegex    from 'path-to-regexp'

const W = a => b => a( b )( b )

// TODO: Make it possible to add routes more than once?

// begin routes initialization
const partitionDynamicAndStatic =
  R.partition( R.compose( R.lt( 0 )
                        , R.length
                        , L.get( [ 'regex', 'keys' ] )
                        )
             )

const addRegexes =
  R.map( W( R.compose( L.set( 'regex' )
                     , toRegex
                     , L.get( 'route' )
                     )
          )
       )

const expandRoutes =
  R.compose( R.map( R.zipObj( [ 'route', 'component' ] ) )
           , R.toPairs
           )

const prepareRoutes =
  R.compose( R.zipObj( [ 'dynamic', 'static' ] )
           , partitionDynamicAndStatic
           , addRegexes
           , expandRoutes
           )
// end routes initialization

//

// begin route resolution
const resolveStatic = path =>
  R.compose( R.find( R.propEq( 'route', path ) )
           , L.get( 'static' )
           )

const prepareParams =
  R.compose( R.zipObj
           , R.map( L.get( 'name' ) )
           )

const resolveDynamic = path =>
  R.compose( R.reduce( ( acc, { component, regex } ) =>
                       R.ifElse( R.isNil
                               , R.always( acc )
                               , match =>
                                   R.reduced( { component
                                              , params: prepareParams( regex.keys )( R.tail( match ) )
                                              }
                                            )
                               )( regex.exec( path ) )
                     , false
                     )
           , L.get( 'dynamic' )
           )

const resolveRoute = ( { routes, NotFound }, { path }  ) =>
  U.fromKefir( K( path, path =>
                  { const { component, params } =
                      resolveStatic( path )( routes )
                      || resolveDynamic( path )( routes )
                      || { component: NotFound, path }
                    return React.createElement( component, params )
                  }
                )
             )
// end route resolution

const Router = U.withContext( resolveRoute )

export { Router, prepareRoutes }

import * as R     from "ramda"
import * as L     from "partial.lenses"
import K, * as U  from "karet.util"
import React      from "karet"
import toRegex    from 'path-to-regexp'

// TODO: Make it possible to add routes more than once?

// begin routes initialization
const expandRoutes = rawRoutes =>
  R.pipe( R.toPairs
        , R.map( R.zipObj( [ 'route', 'component' ] ) )
        )( rawRoutes )

const addRegexes = expandedRoutes =>
  R.map( route => R.pipe( L.get( 'route' )
                        , toRegex
                        , L.set( 'regex' )
                        )( route )( route )
       )( expandedRoutes )

const partitionDynamicAndStatic = routesWithRegexes =>
  R.partition( R.pipe( L.get( [ 'regex', 'keys' ] )
                     , R.length
                     , R.lt( 0 )
                     )
             )( routesWithRegexes )

const prepareRoutes = rawRoutes =>
  R.pipe( expandRoutes
        , addRegexes
        , partitionDynamicAndStatic
        , R.zipObj( [ 'dynamicRoutes', 'staticRoutes' ] )
        )( rawRoutes )
// end routes initialization

//

// begin route resolution
const resolveStatic = ( path, { staticRoutes } ) =>
  R.find( R.propEq( 'route', path ) )( staticRoutes )

const prepareParams = ( keys, matches ) =>
  R.pipe( R.map( L.get( 'name' ) )
        , R.zipObj
        )( keys, matches )

const resolveDynamic = ( path, { dynamicRoutes } ) =>
  R.reduce( ( acc, { component, regex } ) =>
              R.ifElse( R.isNil
                      , R.always( acc )
                      , match =>
                          R.reduced( { component
                                     , props: prepareParams( regex.keys, R.tail( match ) )
                                     }
                                   )
                      )( regex.exec( path ) )
          , false
          )( dynamicRoutes )

const resolveRoute = ( { routes, NotFound }, { path }  ) =>
  U.fromKefir( K( path, path =>
                  { const { component, props } =
                      resolveStatic( path, routes )
                      || resolveDynamic( path, routes )
                      || { component: NotFound }
                    return React.createElement( component, props )
                  }
                )
             )
// end route resolution

const Router = U.withContext( resolveRoute )

export { Router, prepareRoutes }

import * as R     from "ramda"
import * as U     from "karet.util"
import React      from "karet"
import toRegex    from 'path-to-regexp'

// TODO: Make it possible to add routes more than once?

// begin routes initialization
const expandRoutes =
  R.pipe( R.toPairs
        , R.map( R.zipObj( [ 'route', 'Component' ] ) )
        )

const addRegexes =
  R.map( entry =>
         ( { ...entry, regex: toRegex( entry.route ) } )
       )

const sortByStaticThenDynamic =
  R.sortBy( ( { regex } ) => regex.keys.length )

export const prepareRoutes =
  R.pipe( expandRoutes
        , addRegexes
        , sortByStaticThenDynamic
        )
// end routes initialization

// route resolution
const router = U.lift( ( { routes, NotFound }, { path } ) =>
     { for ( let i = 0; i < routes.length; ++i ) {
         const { Component, regex } = routes[ i ]
         const match = regex.exec( path )
         if ( match )
           return <Component { ...R.zipObj( regex.keys, R.tail( match ) ) }/>
       }
       return <NotFound/>
     }
   )

export const Router = U.withContext( R.pipe( router, U.fromKefir ) )

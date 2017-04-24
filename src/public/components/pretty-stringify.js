import K, * as U from "karet.util"
import React     from "karet"

export const PrettyStringify = ( { space, obj } ) =>
  <pre>
    { U.lift( x => JSON.stringify( x, null, Number( space ) ) )( obj ) }
  </pre>

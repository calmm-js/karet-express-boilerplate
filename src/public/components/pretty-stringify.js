import K, * as U from "karet.util"
import React     from "karet"

export const PrettyStringify = space => ( o, ...props ) =>
  <pre { ...props }>
    { U.lift( x => JSON.stringify( x, null, space ) )( o ) }
  </pre>
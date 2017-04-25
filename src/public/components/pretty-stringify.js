import K, * as U from "karet.util"
import React     from "karet"

export default ( { value, replacer = null, space = 2 } ) =>
  <pre className="pretty-stringify">
    { U.lift( JSON.stringify )( value, replacer, space ) }
  </pre>

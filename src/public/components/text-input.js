import K, * as U from "karet.util"
import React     from "karet"

export const TextInput = ( { value } ) =>
  <input type="text"
         value={ value }
         onChange={ U.getProps( { value } ) }/>

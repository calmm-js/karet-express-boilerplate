import K, * as U from "karet.util"
import React     from "karet"

export default
  ( { value, mount, onChange, ...props } ) =>
    <input type="text"
           value={ value }
           onChange={ U.actions( U.getProps( { value } ), onChange ) }
           ref={ mount }
           { ...props }/>

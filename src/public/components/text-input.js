import * as React from 'karet'
import * as U from 'karet.util'

export const TextInput = ({value, mount, onChange, ...props}) => (
  <input
    type="text"
    value={value}
    onChange={U.actions(U.getProps({value}), onChange)}
    ref={mount}
    {...props}
  />
)

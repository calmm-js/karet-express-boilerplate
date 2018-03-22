import * as React from 'karet'
import * as U from 'karet.util'

export const PrettyStringify = ({value, replacer = null, space = 2}) => (
  <pre className="pretty-stringify">{U.stringify(value, replacer, space)}</pre>
)

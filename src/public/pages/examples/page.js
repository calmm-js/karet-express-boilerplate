import * as React from 'karet'

import {PathParams} from './path-params'
import {QuerystringParams} from './querystring-params'

export const Examples = ({path, params, ...props}) => (
  <div>
    <h1>Examples</h1>
    <PathParams {...{path, props}} />
    <QuerystringParams {...{path, params}} />
  </div>
)

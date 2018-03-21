import * as Kefir from 'kefir'
import * as L from 'partial.lenses'
import * as R from 'ramda'
import * as React from 'karet'
import * as ReactDOM from 'react-dom'
import * as U from 'karet.util'

import MaybeSessionStored from '../client/maybe-session-stored'
import {location} from '../client/window'

import * as Request from '../client/request'
import * as RPC from '../client/rpc'

import Page from './components/page'

import * as Meta from './meta'
import * as State from './state'

//

const state = MaybeSessionStored({
  key: 'state',
  value: JSON.parse(
    document.getElementById('app-state').getAttribute('data-state')
  )
})

//

const context = State.context(location, window.location.host, state)

//

context.meta.changes().onValue(Meta.setToHead)

//

if (process.env.NODE_ENV !== 'production') {
  window.Kefir = Kefir
  window.L = L
  window.R = R
  window.RPC = RPC
  window.React = React
  window.Request = Request
  window.U = U
  window.context = context
  window.state = state

  state.log('state')
}

//

ReactDOM.render(
  <U.Context {...{context}}>
    <Page />
  </U.Context>,
  document.getElementById('app-view')
)

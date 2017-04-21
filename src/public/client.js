import * as Kefir from "kefir"
import * as L     from "partial.lenses"
import * as R     from "ramda"
import * as U     from "karet.util"
import React      from "karet"
import ReactDOM   from "react-dom"

import MaybeSessionStored from "../client/maybe-session-stored"
import {location}         from "../client/window"

import Page from "./components/page"

import * as Meta  from "./meta"
import * as State from "./state"

//

const state = MaybeSessionStored({
  key: "state",
  value: JSON.parse(document
                    .getElementById("app-state")
                    .getAttribute("data-state"))
})

//

const context = State.context(location, window.location.host, state)

//

context.meta.changes().onValue(Meta.setToHead)

//

if (process.env.NODE_ENV !== "production") {
  window.Kefir = Kefir
  window.L = L
  window.R = R
  window.React = React
  window.U = U
  window.state = state

  state.log("state")
}

//

ReactDOM.render(<U.Context {...{context}}><Page/></U.Context>,
                document.getElementById("app-view"))

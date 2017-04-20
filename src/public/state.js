import * as U  from "karet.util"

import paramsI from "../shared/search-params"

import * as Meta from "./meta"

// NOTE: Only state here that must be sent from server to client as a JSON blob.
export const initial = {
  // State
}

const searchParamsL = ["search", paramsI]

export const context = (location, host, state) => ({
  location,
  host,
  params: U.view(searchParamsL, location),
  path: U.view("path", location),
  state,
  meta: Meta.get(location, host)
})

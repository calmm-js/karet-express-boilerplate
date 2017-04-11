import * as R from "ramda"
import * as U from "karet.util"

import * as Req from "./request"

export const mkGet = entry => R.pipe(
  Req.withParams(entry),
  Req.withHome,
  Req.getJSON,
  U.flatMapErrors(error => {
    return {error}}),
  U.startWith(undefined))

export const mkPost = entry => R.pipe(
  Req.postJSON(Req.withHome(entry)),
  U.flatMapErrors(error => {
    return {error}}),
  U.startWith(undefined))

import * as R from 'ramda'
import * as U from 'karet.util'

import * as Req from './request'

const mkNobody = R.curry((op, entry, params) =>
  U.seq(
    op(Req.withHome(Req.withParams(entry, params))),
    U.flatMapErrors(error => ({error})),
    U.startWith(undefined)
  )
)

export const mkDelete = /*#__PURE__*/ mkNobody(Req.deleteJSON)
export const mkGet = /*#__PURE__*/ mkNobody(Req.getJSON)

export const mkBody = R.curry((op, entry, params, body) =>
  U.seq(
    op(Req.withHome(Req.withParams(entry, params)), body),
    U.flatMapErrors(error => ({error})),
    U.startWith(undefined)
  )
)

export const mkPost = /*#__PURE__*/ mkBody(Req.postJSON)
export const mkPut = /*#__PURE__*/ mkBody(Req.putJSON)

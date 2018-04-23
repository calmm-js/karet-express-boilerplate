import * as R from 'ramda'
import * as U from 'karet.util'

import * as Req from './request'

const mkNobody = R.curry((op, entry, params) =>
  U.thru(
    U.template({entry, params}),
    U.flatMapLatest(({entry, params}) =>
      U.thru(
        op(Req.withHome(Req.withParams(entry, params))),
        U.startWith(undefined)
      )
    ),
    U.flatMapErrors(error => ({error})),
    U.toProperty
  )
)

export const mkDelete = /*#__PURE__*/ mkNobody(Req.deleteJSON)
export const mkGet = /*#__PURE__*/ mkNobody(Req.getJSON)

export const mkBody = R.curry((op, entry, params, body) =>
  U.thru(
    U.template({entry, params, body}),
    U.flatMapLatest(({entry, params, body}) =>
      U.thru(
        op(Req.withHome(Req.withParams(entry, params)), body),
        U.startWith(undefined)
      )
    ),
    U.flatMapErrors(error => ({error})),
    U.toProperty
  )
)

export const mkPost = /*#__PURE__*/ mkBody(Req.postJSON)
export const mkPut = /*#__PURE__*/ mkBody(Req.putJSON)

import * as U from 'karet.util'
import * as R from 'ramda'
import * as L from 'partial.lenses'

/// XXX validate a bit more carefully
export const parse = /*#__PURE__*/ U.lift(
  R.pipe(
    R.defaultTo(''),
    R.split(/[?&]/),
    R.filter(R.identity),
    R.map(R.split('=')),
    R.fromPairs,
    R.map(decodeURIComponent)
  )
)

export const format = /*#__PURE__*/ R.pipe(
  R.defaultTo({}),
  R.map(encodeURIComponent),
  R.toPairs,
  R.map(R.join('=')),
  R.join('&'),
  R.ifElse(R.equals(''), R.always(''), R.concat('?'))
)

export const paramsI = /*#__PURE__*/ L.iso(parse, format)

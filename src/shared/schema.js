import * as V from 'partial.lenses.validation'
import * as R from 'ramda'

export * from 'partial.lenses.validation'

export const maxLength = n => x => x.length <= n

export const stringMax = n => V.and(R.is(String), maxLength(n))

export const regExp = re => R.both(R.is(String), R.test(re))

// Not the full story, but suffices here.
export const isoDate = regExp(
  /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/
)

export const created = isoDate
export const modified = isoDate

export const nonNegDec = regExp(/^0|[1-9][0-9]*$/)
export const offset = nonNegDec
export const limitMax = n => V.and(nonNegDec, x => Number(x) <= n)
export const windowMax = n => V.props({offset, limit: limitMax(n)})

export const nullable = s => V.or(R.identical(null), s)

export const rowCount = V.props({rowCount: R.is(Number)})

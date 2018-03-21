import * as S from 'schemation'
import * as R from 'ramda'

export * from 'schemation'

export const maxLength = n => S.where(x => x.length <= n)

export const stringMax = n => S.and(S.string, maxLength(n))

// Not the full story, but suffices here.
export const isoDate = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/

export const created = isoDate
export const modified = isoDate

export const nonNegDec = /^0|[1-9][0-9]*$/
export const offset = nonNegDec
export const limitMax = n => S.and(nonNegDec, S.where(x => Number(x) <= n))
export const windowMax = n => ({offset, limit: limitMax(n)})

export const nullable = s => S.or(null, s)

export const rowCount = {rowCount: S.number}

export const asString = schema => S.where(R.pipe(String, S.matches(schema)))

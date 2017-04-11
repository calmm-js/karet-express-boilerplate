import * as R from "ramda"
import * as L from "partial.lenses"

/// XXX validate a bit more carefully
const parse = R.pipe(
  R.defaultTo(""),
  R.split(/[?&]/),
  R.filter(R.identity),
  R.map(R.split("=")),
  R.fromPairs,
  R.map(decodeURIComponent))

const format = R.pipe(
  R.defaultTo({}),
  R.map(encodeURIComponent),
  R.toPairs,
  R.map(R.join("=")),
  R.join("&"),
  R.ifElse(R.equals(""), R.always(""), R.concat("?")))

export default L.iso(parse, format)

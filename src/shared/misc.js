import * as L from "partial.lenses"
import util   from "util"

export const formatError = error =>
  error instanceof Error    ? error.trace :
  typeof error === "object" ? util.inspect(error, {depth: null}) :
  error

export const paramFlag = key =>
  [key,
   L.choose(v => L.replace(v, v === "1")),
   L.defaults(false),
   L.replace("1", true)]

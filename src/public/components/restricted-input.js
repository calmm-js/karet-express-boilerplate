import * as React from "karet"
import K, * as U  from "karet.util"

export const RestrictedInput = ({value, meta: {format, parse}, edited = U.atom(), ...props}) => {
  const shown = K(value, edited, (value, edited) =>
                  edited === undefined ? format(value) : edited)
  const exit = e => {edited.set()
                     e.target.blur()}
  const validity = K(shown, s => parse(s) !== undefined ? "valid" : "invalid")
  return <input className={U.string`restricted-input ${validity}`}
                value={shown}
                onChange={({target: {value: input}}, result = parse(input)) =>
                          result !== undefined
                          ? U.holding(() => {edited.set()
                                             value.set(result)})
                          : edited.set(input)}
                onKeyDown={e => e.key === "Escape" && exit(e)}
                onBlur={exit}
                {...props}/>
}

export const number = {
  format: n => n.toString(),
  parse(s) {
    const n = parseFloat(s)
    return n.toString() === s ? n : undefined
  }
}

export const path = {
  format: p => p,
  parse(s) {
    const p = s.replace( '//', '/' )
    return p === s ? p : undefined
  }
}

export const NumberInput = ({meta = path, type="number", ...props}) =>
  <RestrictedInput {...{meta, type}} {...props}/>

export const PathInput = ({meta = path, type="text", ...props}) =>
  <RestrictedInput {...{meta, type}} {...props}/>

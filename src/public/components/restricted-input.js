import * as React from 'karet'
import * as U from 'karet.util'

export function RestrictedInput({value, meta, edited = U.atom(), ...props}) {
  const format = U.lift(meta.format)
  const parse = U.lift(meta.parse)
  const shown = U.ifte(U.isNil(edited), format(value), edited)
  function exit(e) {
    edited.set()
    e.target.blur()
  }
  const validity = U.ifte(U.isNil(parse(shown)), 'invalid', 'valid')
  function onChange({target: {value: input}}) {
    const result = parse(input)
    if (result !== undefined)
      U.holding(() => {
        edited.set()
        value.set(result)
      })
    else edited.set(input)
  }
  return (
    <input
      className={U.string`restricted-input ${validity}`}
      value={shown}
      onChange={onChange}
      onKeyDown={e => e.key === 'Escape' && exit(e)}
      onBlur={exit}
      {...props}
    />
  )
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
    const p = s.replace('//', '/')
    return p === s ? p : undefined
  }
}

export const NumberInput = ({meta = path, type = 'number', ...props}) => (
  <RestrictedInput {...{meta, type}} {...props} />
)

export const PathInput = ({meta = path, type = 'text', ...props}) => (
  <RestrictedInput {...{meta, type}} {...props} />
)

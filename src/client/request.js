import * as Kefir from "kefir"
import * as L     from "partial.lenses"
import * as R     from "ramda"

import paramsI from "../shared/search-params"

export const withParams = /*#__PURE__*/R.curry((base, params) =>
  `${base}${L.getInverse(paramsI, params)}`)

const home = typeof window === "undefined"
  ? ""
  : `${window.location.protocol}//${window.location.host}`

export const withHome = path => `${home}/${path}`

const onClient = typeof window === "undefined"
  ? fn => R.curryN(fn.length, () => Kefir.constant(undefined))
  : fn => fn

export const xhrJSON = /*#__PURE__*/onClient(({
  method,
  url,
  body
}) => Kefir.stream(emitter => {
  const xhr = new XMLHttpRequest()

  xhr.open(method, url, true)

  xhr.onload = () => {
    if (200 <= xhr.status && xhr.status <= 299) {
      try {
        emitter.emit(JSON.parse(xhr.response) || null)
      } catch (e) {
        emitter.error(e)
      }
    } else {
      const message =
        typeof xhr.response === "string" && xhr.response
        ? ` (${xhr.response})`
        : ""

      emitter.error(`${xhr.status}: ${xhr.statusText}${message}`)
    }
    emitter.end()
  }

  xhr.onerror = error => {
    emitter.error(error)
    emitter.end()
  }

  if (body !== undefined) {
    xhr.setRequestHeader("content-type", "application/json")
    xhr.send(JSON.stringify(body))
  } else {
    xhr.send()
  }

  return () => xhr.abort()
}))

export const getJSON = /*#__PURE__*/onClient(url =>
  xhrJSON({method: "GET", url}))
export const putJSON = /*#__PURE__*/onClient(R.curry((url, body) =>
  xhrJSON({method: "PUT", url, body})))
export const postJSON = /*#__PURE__*/onClient(R.curry((url, body) =>
  xhrJSON({method: "POST", url, body})))

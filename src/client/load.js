import * as Kefir from "kefir"

export const load = src => typeof window === "undefined" ? Kefir.never() : Kefir.stream(emitter => {
  const script = document.createElement("script")
  script.type = "text/javascript"
  script.onerror = event => {emitter.error(event); emitter.end()}
  script.onload = event => {emitter.value(event); emitter.end()}
  script.async = 1
  document.head.appendChild(script)
  script.src = src
}).toProperty()

export const call = (loaded, fn) => (...args) => loaded.onValue(() => fn(...args))

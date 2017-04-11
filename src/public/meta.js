import * as L from "partial.lenses"
import * as R from "ramda"
import * as U from "karet.util"

const metaDefault = {
  title: "KEEP CALMM and CURRY ON",
  description: "Seriously, just keep Calmm."
}

const metas = {
  '/': metaDefault,
  '/another-page': {
    title: "Another page",
    description: "Yes, you can have multiple pages"
  }
}

const urls = [L.props("img", "url"), L.values]

export const get = U.lift(({path}, host) =>
  L.modify(urls, url => `http://${host}/${url}`, metas[path] || metaDefault))

const props = [
  ['name="description"',         "description"],
  ['name="twitter:card"',        R.always("summary_large_image")],
  ['name="twitter:description"', "description"],
  ['name="twitter:title"',       "title"],
  ['property="og:description"',  "description"],
  ['property="og:title"',        "title"],
  ['property="og:type"',         R.always("website")]
]

export const setToHead = meta => props.forEach(
  ([p, l]) => document.head.querySelector(`[${p}]`).content = L.get(l, meta))

export const renderToStrings = meta => props.map(
  ([p, l]) => `<meta ${p} content="${L.get(l, meta)}">`)

import * as L from 'partial.lenses'
import * as R from 'ramda'
import * as U from 'karet.util'

const metaDefault = {
  title: 'KEEP CALMM and CURRY ON',
  description: 'Seriously, just keep Calmm.'
}

const metas = {
  '/': metaDefault,
  '/another-page': {
    title: 'Another page',
    description: 'Yes, you can have multiple pages'
  }
}

const urls = [L.props('img', 'url'), L.values]

export const get = U.lift(({path}, host) =>
  L.modify(urls, url => `http://${host}/${url}`, metas[path] || metaDefault)
)

//

const title = {
  set: m => (document.title = m.title),
  render: m => `<title>${m.title}</title>`
}

const meta = (p, l) => ({
  set: m => (document.head.querySelector(`[${p}]`).content = L.get(l, m)),
  render: m => `<meta ${p} content="${L.get(l, m)}">`
})

const props = [
  title,
  meta('name="description"', 'description'),
  meta('name="twitter:card"', R.always('summary_large_image')),
  meta('name="twitter:description"', 'description'),
  meta('name="twitter:title"', 'title'),
  meta('property="og:description"', 'description'),
  meta('property="og:title"', 'title'),
  meta('property="og:type"', R.always('website'))
]

export const setToHead = m => props.forEach(p => p.set(m))
export const renderToStrings = m => props.map(p => p.render(m))

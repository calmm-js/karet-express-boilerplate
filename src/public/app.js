import * as React from 'karet'
import * as ReactDOM from 'react-dom/server'
import * as U from 'karet.util'
import express from 'express'

import * as contactsApp from './pages/contacts/app'

import env from '../shared/env'

import Page from './components/page'

import {routes} from './routes'
import * as Meta from './meta'
import * as State from './state'

const isProd = process.env.NODE_ENV === 'production'

const bust = isProd ? `?ts=${new Date().getTime()}` : ''

const envData = ReactDOM.renderToStaticMarkup(
  <div id="env-data" data-env={JSON.stringify(env)} />
)

export const router = express.Router()

router.use(contactsApp.router)

router.get(Object.keys(routes), ({path, url, headers: {host}}, res) => {
  const location = {
    path,
    search: url.slice(path.length),
    hash: ''
  }
  const state = U.atom(State.initial)
  const context = State.context(location, host, state)

  // XXX Inject state here.

  const app = ReactDOM.renderToString(
    <U.Context {...{context}}>
      <Page />
    </U.Context>
  )

  const appState = ReactDOM.renderToStaticMarkup(
    <div id="app-state" data-state={JSON.stringify(state.get())} />
  )

  const meta = context.meta

  res.setHeader('X-UA-Compatible', 'IE=edge')
  res.send(`<!DOCTYPE html>
<html lang="fi">
  <head>
    <link rel="icon" href="https://avatars1.githubusercontent.com/u/17234211">
    <link rel="stylesheet" href="/public/generated/bundle.css${bust}">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=EDGE">
    ${Meta.renderToStrings(meta).join('\n    ')}
  </head>
  <body>
    <div id="app-view">${isProd ? app : ''}</div>
    ${appState}
    ${envData}
    <script type="text/javascript" src="/public/generated/bundle.js${bust}" async></script>
  </body>
</html>`)
})

if (process.env.NODE_ENV !== 'production') {
  router.get('/test', (req, res) => {
    res.send(JSON.stringify(req.query))
  })
}

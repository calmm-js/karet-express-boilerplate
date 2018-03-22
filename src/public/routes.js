import * as Contacts from './pages/contacts/ui'
import {Examples} from './pages/examples/page'
import {Main} from './pages/main'

import {prepare} from '../shared/routing'

export const routes = prepare({
  '/': {Component: Main, name: 'Main'},
  '/another-page': {Component: Main, name: 'Another page'},
  '/examples/:pathParam1/:pathParam2/:pathParam3?/:splat*': {
    Component: Examples,
    name: 'Examples',
    href: '/examples/keep/calmm/and/curry/on/?hello=world'
  },
  '/contacts': {Component: Contacts.Browse, name: 'Contacts'},
  '/contacts/new': {Component: Contacts.New},
  '/contacts/:id': {Component: Contacts.Edit}
})

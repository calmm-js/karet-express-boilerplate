import * as Contacts from './pages/contacts/ui'
import {Examples} from './pages/examples/page'
import {Main} from './pages/main'

export const routes = {
  '/': Main,
  '/another-page': Main,
  '/examples/:pathParam1?/:pathParam2?/:pathParam3?/:splat*': Examples,
  '/contacts': Contacts.Browse,
  '/contacts/new': Contacts.New,
  '/contacts/:id': Contacts.Edit
}

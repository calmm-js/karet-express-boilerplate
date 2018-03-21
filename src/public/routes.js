import * as Contacts from './pages/contacts/ui'
import ExamplesPage from './pages/examples/page'
import Main from './pages/main'

import {prepareRoutes} from './components/router'

const routes = {
  '/': Main,
  '/examples/:pathParam1?/:pathParam2?/:pathParam3?/:splat*': ExamplesPage,
  '/contacts': Contacts.Browse,
  '/contacts/new': Contacts.New,
  '/contacts/:id': Contacts.Edit
}

export default prepareRoutes(routes)

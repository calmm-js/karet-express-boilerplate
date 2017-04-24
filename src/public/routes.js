import { prepareRoutes } from "./components/router"
import Main              from "./pages/main"
import Company           from "./pages/company"
import ExamplesPage      from "./pages/examples/page"
import Contacts          from "./pages/contacts"
import Meiosis           from "./pages/meiosis"
import Form              from "./pages/form/page"

const routes =
  { '/': Main
  , '/company': Company
  , '/examples/:pathParam1?/:pathParam2?/:pathParam3?/:splat*': ExamplesPage
  , '/contacts': Contacts
  , '/meiosis': Meiosis
  , '/form': Form
  }

export default prepareRoutes( routes )

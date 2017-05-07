import { prepareRoutes } from "./components/router"
import Main              from "./pages/main"
import ExamplesPage      from "./pages/examples/page"
import Contacts          from "./pages/contacts"
import Form              from "./pages/form/page"

const routes =
  { '/': Main
  , '/examples/:pathParam1?/:pathParam2?/:pathParam3?/:splat*': ExamplesPage
  , '/contacts': Contacts
  , '/form': Form
  }

export default prepareRoutes( routes )

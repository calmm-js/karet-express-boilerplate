import { prepareRoutes } from "./components/router"
import Main              from "./pages/main"
import Contacts          from "./pages/contacts"
import AnotherPage       from "./pages/another-page"
import Form              from "./pages/form/page"
import Meiosis           from "./pages/meiosis"
import Company           from "./pages/company"

const routes = {
  '/': Main,
  '/contacts': Contacts,
  '/main/:id': Main,
  '/another-page': AnotherPage,
  '/form': Form,
  '/meiosis': Meiosis,
  '/company': Company
}

export default prepareRoutes( routes )

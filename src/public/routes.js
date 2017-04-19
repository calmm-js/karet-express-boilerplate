import { prepareRoutes } from "./components/router"
import Main              from "./pages/main"
import AnotherPage       from "./pages/another-page"
import Form              from "./pages/form/page"
import Meiosis           from "./pages/meiosis"

const routes = {
  '/': Main,
  '/main/:id': Main,
  '/another-page': AnotherPage,
  '/form': Form,
  '/meiosis': Meiosis
}

export default prepareRoutes( routes )

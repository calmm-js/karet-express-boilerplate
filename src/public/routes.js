import Router      from "./components/router"
import Main        from "./pages/main"
import AnotherPage from "./pages/another-page"
import Form        from "./pages/form/page"

const routes = {
  '/': Main,
  '/main/:id': Main,
  '/another-page': AnotherPage,
  '/form': Form
}

export default Router.init( routes )

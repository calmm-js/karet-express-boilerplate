import * as React from 'karet'

import NotFound from '../pages/not-found'

import routes from '../routes'

import Header from './header'
import {Router} from './router'

export default () => (
  <div>
    <Header />
    <Router {...{routes, NotFound}} />
  </div>
)

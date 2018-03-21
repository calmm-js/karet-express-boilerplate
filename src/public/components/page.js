import * as React from 'karet'

import {NotFound} from '../pages/not-found'

import {routes} from '../routes'

import {Header} from './header'
import {Router} from './router'

export const Page = () => (
  <div>
    <Header />
    <Router {...{routes, NotFound}} />
  </div>
)

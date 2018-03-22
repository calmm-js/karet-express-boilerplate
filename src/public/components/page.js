import * as React from 'karet'

import {NotFound} from '../pages/not-found'

import {Header} from './header'
import {Router} from './router'

export const Page = () => (
  <div>
    <Header />
    <Router {...{NotFound}} />
  </div>
)

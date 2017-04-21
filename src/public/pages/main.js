import * as U from "karet.util"
import React  from "karet"

import Link from "../components/link"

const libs = [
  ["Kefir", "https://rpominov.github.io/kefir", "Kefir"],
  ["L", "https://github.com/calmm-js/partial.lenses/#partial-lenses", "Partial Lenses"],
  ["R", "http://ramdajs.com/", "Ramda"],
  ["React", "https://github.com/calmm-js/karet#karet", "Karet"],
  ["U", "https://github.com/calmm-js/karet.util#karet-util", "Karet Util"]
]

export default () =>
  <div>
    <h1>Welcome!</h1>
    <p>
      This is the Calmm boilerplate sample application.  This sample is just
      meant to be a starting point or reference and you should always rewrite
      this to suit your specific needs.  After studying this sample, you'll
      probably first delete all the sample pages and then write your own.  Have
      fun!
    </p>

    <h2>Development and Production modes</h2>
    <p>When you start this application with</p>
    <pre>npm run watch</pre>
    <p>this application runs in development mode and with</p>
    <pre>npm run bundle && NODE_ENV=production npm start</pre>
    <p>this application runs in production mode.</p>
    <p>
      Note that this sample performs server side rendering, but the server side
      render is only sent to the client in production mode.  That is basically
      done to avoid having to restart the server after each change of rendering
      code.
    </p>

    <h2>State and LiveReload</h2>
    <p>
      In this sample, application state is persisted to session storage by
      default, so you can refresh the browser window without losing state.  In
      development mode this sample also supports <Link
      href="http://livereload.com/">LiveReload</Link>, which means that if you
      have the plugin and you edit and save code, your browser will
      automatically reload the page.
    </p>

    <h2>Debug exports</h2>
    <p>In development mode this sample exposes a number of libraries</p>
    <table>
      <tbody>
        {U.seq(libs, U.map(([v, l, n]) =>
           <tr key={v}>
             <td><code>{v}</code></td>
             <td><Link href={l}>{n}</Link></td>
           </tr>))}
      </tbody>
    </table>
    <p>and application state</p>
    <table>
      <tbody>
        <tr>
          <td><code>context</code></td>
          <td>application global context</td>
        </tr>
        <tr>
          <td><code>state</code></td>
          <td>application global state&mdash;also available as <code>context.state</code></td>
        </tr>
      </tbody>
    </table>
    <p>
      on the <code>window</code> object and also logs application state changes.
      If you open the JavaScript console you can play with those.  For example,
      try to run the following in the JavaScript console:
    </p>
    <pre>context.path.set('/contacts')</pre>
    <p>
      You can also similarly modify the application <code>state</code> used by
      components on the sample pages.
    </p>
  </div>

import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import express from 'express'
import serveStatic from 'serve-static'
import {resolve} from 'path'

import publicApp from '../public/app'

const isProd = process.env.NODE_ENV === 'production'

//

const app = express()
app.disable('x-powered-by')

//

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(compression())

//

app.use((error, req, res, _) => {
  res.status(error.status)
  res.type('text/plain')
  res.send('Error parsing body')
})

//

app.use(
  '/public',
  serveStatic(resolve(__dirname, '../../public'), {
    setHeaders(res) {
      res.setHeader(
        'Cache-Control',
        isProd ? 'public, max-age=31536000' : 'private, max-age=0, no-cache'
      )
    }
  })
)

//

publicApp(app)

//

app.use((err, req, res, next) => {
  console.error(err)
  if (res.headersSent) {
    next(err)
  } else {
    res.status(500)
    res.type('text/plain')
    res.send(`${'message' in err ? err.message : err}`)
  }
})

//

export default (port, cb) => {
  const server = app.listen(port, () => {
    console.log(`Server listening at port ${server.address().port}`)
    cb && cb()
  })
}

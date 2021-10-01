import { readConfigSync } from '../_util/config-loader.js'
import { Express2 } from '../web/_express/express2.js'
import { INVALID_DATA } from '../_type/error.js'

const config = readConfigSync('config/app-dev.json')
const web = Express2.from(config)

web.router.get('/test/hello', (req, res) => {
  res.send('<html><body><h1>Hello</h1></body></html>')
})

web.router.get('/test/system-error', function (req, res, done) {
  done(new Error('Error Sample'))
})

web.router.get('/test/form-error', function (req, res, done) {
  done(INVALID_DATA)
})

process.on('uncaughtException', function (err) {
  console.error(err.stack)
  process.exit(1)
})

process.on('SIGINT', function () {
  console.log('SIGINT caught')
  process.exit(1)
})

web.start().then(() => {
  console.log('express: listening ' + config.port)
  const mainUrl = config.mainUrl
  console.log(mainUrl + '/test/hello')
  console.log(mainUrl + '/test/system-error')
  console.log(mainUrl + '/test/form-error')
})

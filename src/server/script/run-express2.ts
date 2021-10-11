import { loadConfigSync } from '../_util/config-loader'
import { Express2 } from '../web/_express/express2'
import { INVALID_DATA } from '../_type/error'

const config = loadConfigSync('config/app-dev.json')
const web = Express2.from(config)

web.router.get('/hello', (req, res) => {
  res.send('<html><body><h1>Hello</h1></body></html>')
})

web.router.get('/page-error', function (req, res, done) {
  done(new Error('Error Sample'))
})

web.router.get('/api/invalid-data', function (req, res, done) {
  done(INVALID_DATA)
})

process.on('uncaughtException', function (err) {
  console.error(err.stack)
  process.exit(1)
})

process.on('SIGINT', function () {
  console.log('\nSIGINT caught')
  process.exit(1)
})

web.start().then(() => {
  console.log('express: listening ' + config.port)
  const mainUrl = config.mainUrl
  console.log(mainUrl + '/hello')
  console.log(mainUrl + '/page-error')
  console.log(mainUrl + '/api/invalid-data')
})

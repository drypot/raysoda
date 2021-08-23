import { INVALID_DATA } from '../../lib/base/error2.js'
import { configFrom } from '../../config/config.js'
import { Express2 } from './express2.js'

const config = configFrom('config/app-dev.json')
const express = Express2.from(config)
const router = express.router

router.get('/test/hello', (req, res) => {
  res.send('<html><body><h1>Hello</h1></body></html>')
})

router.get('/test/system-error', function (req, res, done) {
  done(new Error('Error Sample'))
})

router.get('/test/form-error', function (req, res, done) {
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

express.start().then(() => {
  console.log('express: listening ' + config.port)
  const siteUrl = config.siteUrl
  console.log(siteUrl + '/test/hello')
  console.log(siteUrl + '/test/system-error')
  console.log(siteUrl + '/test/form-error')
})

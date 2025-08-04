import { loadConfigSync } from '../common/util/config-loader.ts'
import { Express2 } from '../express/express2.ts'

const config = loadConfigSync('config/raysoda-dev.json')
const express2 = Express2.from(config)

process.on('uncaughtException', function (err) {
  console.error(err.stack)
  process.exit(1)
})

process.on('SIGINT', function () {
  console.log('\nSIGINT caught')
  process.exit(1)
})

express2.start().then(() => {
  console.log('express: listening ' + config.port)
  const mainUrl = config.mainUrl
  console.log(mainUrl + '/hello')
  console.log(mainUrl + '/system-error')
  console.log(mainUrl + '/api/invalid-data')
})

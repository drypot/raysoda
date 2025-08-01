import { loadConfigSync } from '../common/util/config-loader.js'
import { Express2 } from '../express/express2.js'

const config = loadConfigSync('config/app-dev.json')
const web = Express2.from(config)

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
  console.log(mainUrl + '/system-error')
  console.log(mainUrl + '/api/invalid-data')
})

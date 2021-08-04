import { Mailer } from './mailer2.js'
import { loadConfig } from '../config/config.js'
import * as os from 'os'

if (!process.argv[2]) {
  throw new Error('config not found')
}

const config = loadConfig(process.argv[2])
const mailer = new Mailer(config)
mailer.initTransport()

const mail = {
  from: 'no-reply@raysoda.com',
  to: 'drypot@gmail.com',
  subject: 'mail server test from ' + os.hostname(),
  text: `Hello, ${new Date()}`
}

console.log(mail)

mailer.sendMail(mail, function (err) {
  console.log(err);
})

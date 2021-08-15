import { Mailer } from './mailer2.js'
import { loadConfig } from '../../app/config/config.js'
import * as os from 'os'

const config = loadConfig(process.argv[2])
const mailer = new Mailer(config)
mailer.initTransport()

const mail = {
  from: 'no-reply@raysoda.com',
  to: process.argv[3],
  subject: 'mail server test from ' + os.hostname(),
  text: `Hello, ${new Date()}`
}

console.log(mail)

mailer.sendMail(mail).catch(err => {
  console.log(err)
})

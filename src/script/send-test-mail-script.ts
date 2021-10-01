import { Mailer } from '../mailer/mailer2.js'
import { readConfigSync } from '../_util/config-loader.js'
import { logError } from '../_util/error2.js'

async function main() {
  const config = readConfigSync(process.argv[2])
  const mailer = await Mailer.from(config).initTransport()
  const mail = {
    from: 'no-reply@raysoda.com',
    to: process.argv[3],
    subject: 'Test',
    text: 'Test.\nTest.\nTest.'
  }
  console.log(mail)
  await mailer.sendMail(mail)
}

main().then(() => {
  console.log('mail sent.')
}).catch((err) => {
  logError(err)
}).finally(async () => {
  //
})

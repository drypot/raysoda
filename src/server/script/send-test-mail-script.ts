import { Mailer } from '../mailer/mailer2'
import { loadConfigSync } from '../_util/config-loader'
import { logError } from '../_util/error2'

async function main() {
  const config = loadConfigSync(process.argv[2])
  const mailer = await Mailer.from(config).loadSync()
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

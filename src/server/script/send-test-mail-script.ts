import { Mailer } from '../mailer/mailer2'
import { logError } from '../_util/error2'

async function main() {
  const mailer = Mailer.from(process.argv[2])
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
}).finally(() => {
  //
})

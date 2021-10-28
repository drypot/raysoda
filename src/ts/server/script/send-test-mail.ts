import { logError } from '@common/util/error2'
import { Mailer } from '@server/mailer/mailer2'

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

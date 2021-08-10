import { Mailer } from './mailer2.js'
import { loadConfig } from '../../app/config/config.js'

describe('Mailer', () => {

  let mailer: Mailer

  beforeAll(() => {
    const config = loadConfig('config/app-test.json')
    mailer = new Mailer(config)
    mailer.initTransport()
  })

  it('should work', async () => {
    const mail = {
      from: 'no-reply',
      to: 'drypot@mail.test',
      subject: 'mail server test',
      text: `Hello, ${new Date()}`
    }
    //await expectAsync(mailer.sendMail(mail)).toBeRejectedWithError('Transport is not initialized.')
    await mailer.sendMail(mail)
  })
})


import { Mailer, MSG_TRANSPORT_NOT_INITIALIZED } from './mailer2.js'
import { configFrom } from '../../app/config/config.js'

describe('Mailer', () => {

  let mailer: Mailer

  beforeAll(() => {
    const config = configFrom('config/app-test.json')
    mailer = Mailer.from(config).initTransport()
  })

  describe('sendMail', () => {
    it('sendMail throws MSG_TRANSPORT_NOT_INITIALIZED', async () => {
      const mail = {
        from: 'no-reply',
        to: 'drypot@mail.test',
        subject: 'mail server test',
        text: `Hello, ${new Date()}`
      }
      await expectAsync(mailer.sendMail(mail)).toBeRejectedWithError(MSG_TRANSPORT_NOT_INITIALIZED)
    })
  })
})


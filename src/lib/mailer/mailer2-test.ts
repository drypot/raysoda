import { Mailer } from './mailer2.js'
import { configFrom } from '../../config/config.js'

describe('Mailer', () => {

  let mailer: Mailer

  beforeAll(() => {
    const config = configFrom('config/app-test.json')
    mailer = Mailer.from(config).initTransport()
  })

  describe('sendMail', () => {
    it('sendMail', async () => {
      const mail = {
        from: 'no-reply',
        to: 'drypot@mail.test',
        subject: 'Node Mailer Test',
        text: `Test.\nTest.\nTest.\n`
      }
      const sent = await mailer.sendMail(mail)
      expect(sent).toBe(false)
    })
  })
})


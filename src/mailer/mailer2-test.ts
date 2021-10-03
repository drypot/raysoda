import { Mailer } from './mailer2.js'
import { loadConfigSync } from '../_util/config-loader.js'

describe('Mailer', () => {

  let mailer: Mailer

  beforeAll(() => {
    const config = loadConfigSync('config/app-test.json')
    mailer = Mailer.from(config).loadSync()
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


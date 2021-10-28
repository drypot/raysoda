import { Mailer } from '@server/mailer/mailer2'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('Mailer', () => {

  let mailer: Mailer

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    mailer = await omanGetObject('Mailer') as Mailer
  })

  afterAll(async () => {
    await omanCloseAllObjects()
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


import { Mailer } from '@server/mailer/mailer2'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'

describe('Mailer', () => {

  let mailer: Mailer

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    mailer = await getObject('Mailer') as Mailer
  })

  afterAll(async () => {
    await closeAllObjects()
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


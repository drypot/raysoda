import { closeAllObjects, initObjectContext } from '../oman/oman.ts'
import { getMailer, Mailer } from './mailer2.ts'

describe('Mailer', () => {

  let mailer: Mailer

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    mailer = await getMailer()
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


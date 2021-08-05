import { Mailer } from './mailer2.js'
import { loadConfig } from '../../app/config/config.js'


describe('Mailer', () => {

  let mailer: Mailer

  beforeAll(() => {
    const config = loadConfig('config/test.json')
    mailer = new Mailer(config)
    mailer.initTransport()
  })

  it('should work', () => {
    const mail = {
      from: 'no-reply@raysoda.com',
      to: 'drypot@gmail.com',
      subject: 'mail server test',
      text: 'Hello'
    }
    mailer.sendMail(mail, function (err) {
      expect(err?.message).toBe('Transport not initialized.')
    })
  })
})


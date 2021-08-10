import { Mailer } from './mailer2.js'
import { loadConfig } from '../../app/config/config.js'

describe('Mailer', () => {

  let mailer: Mailer

  beforeAll(() => {
    const config = loadConfig('config/app-test.json')
    mailer = new Mailer(config)
    mailer.initTransport()
  })

  xit('should work', async () => {
    const mail = {
      from: 'no-reply',
      to: 'drypot@mail.test',
      subject: 'mail server test',
      text: `Hello, ${new Date()}`
    }
    // 필요할 때만 메일 데몬을 켜고 테스트하도록 한다.
    // https://github.com/drypot/mac-memo/blob/main/md/mac-postfix-mail-2021.md
    // $ sudo postfix start
    // $ sudo postfix stop
    await mailer.sendMail(mail)
  })
})


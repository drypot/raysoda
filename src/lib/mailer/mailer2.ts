import * as fs from 'fs'
import nodemailer, { createTransport } from 'nodemailer'
import { Config } from '../../app/config/config.js'
import Mail from 'nodemailer/lib/mailer'

export class Mailer {

  public config: Config
  private transport: ReturnType<typeof createTransport> | undefined

  constructor(config: Config) {
    this.config = config
  }

  initTransport() {
    if (this.config.mailServer === 'aws') {
      const data = fs.readFileSync('config-live/ses-smtp-user.json', 'utf8')
      this.transport = nodemailer.createTransport(JSON.parse(data))
      return
    }
    if (this.config.mailServer) {
      this.transport = nodemailer.createTransport({
        host: this.config.mailServer,
        // port 25:  Authentication 이 없어도 된다. 서버간 통신에 사용.
        // port 587: Authentication 과정이 필수로 발생한다.
        port: 25
      })
      return
    }
  }

  sendMail(opt: Mail.Options) {
    return new Promise<void>((resolve, reject) => {
      if (!this.transport) {
        reject(new Error('Transport is not initialized.'))
      } else {
        this.transport.sendMail(opt, (err) => {
          if (err) return reject(err)
          resolve()
        })
      }
    })
  }
}

import * as fs from 'fs'
import nodemailer, { Transporter } from 'nodemailer'
import { Config } from '../../app/config/config.js'
import Mail from 'nodemailer/lib/mailer'

export const MSG_TRANSPORT_NOT_INITIALIZED = 'Transport not initialized.'

export class Mailer {

  public config: Config
  public transport?: Transporter

  private constructor(config: Config) {
    this.config = config
  }

  static from(config: Config) {
    return new Mailer(config)
  }

  initTransport(): Mailer {
    if (this.config.mailServer === 'aws') {
      const data = fs.readFileSync('config-live/ses-smtp-user.json', 'utf8')
      this.transport = nodemailer.createTransport(JSON.parse(data))
      return this
    }
    if (this.config.mailServer) {
      this.transport = nodemailer.createTransport({
        host: this.config.mailServer,
        // port 25:  Authentication 이 없어도 된다. 서버간 통신에 사용.
        // port 587: Authentication 과정이 필수로 발생한다.
        port: 25
      })
      return this
    }
    return this
  }

  sendMail(opt: Mail.Options) {
    return new Promise<Mailer>((resolve, reject) => {
      if (!this.transport) {
        reject(new Error(MSG_TRANSPORT_NOT_INITIALIZED))
      } else {
        this.transport.sendMail(opt, (err) => {
          if (err) return reject(err)
          resolve(this)
        })
      }
    })
  }
}

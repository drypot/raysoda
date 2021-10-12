import * as fs from 'fs'
import nodemailer, { Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { Config } from '../_type/config'
import { omanGetConfig, omanRegisterFactory } from '../oman/oman'

omanRegisterFactory('Mailer', async () => {
  return Mailer.from(omanGetConfig())
})

export class Mailer {

  public config: Config
  public transport: Transporter | undefined

  static from(config: Config) {
    return new Mailer(config)
  }

  private constructor(config: Config) {
    this.config = config
    this.loadConfig()
  }

  // port 25:  Authentication 이 없어도 된다. 서버간 통신에 사용.
  // port 587: Authentication 과정이 필수로 발생한다.
  // 개발중에는 25번 포트를 쓰도록 한다.

  private loadConfig() {
    if (this.config.mailServerConfigPath) {
      const text = fs.readFileSync(this.config.mailServerConfigPath, 'utf8')
      const obj = JSON.parse(text)
      if (obj.host) {
        this.transport = nodemailer.createTransport(obj)
      }
    }
  }

  sendMail(opt: Mail.Options) {
    if (!this.transport) {
      return Promise.resolve(false)
    }
    return new Promise<boolean>((resolve, reject) => {
      (this.transport as Transporter).sendMail(opt, (err) => {
        if (err) return reject(err)
        resolve(true)
      })
    })
  }

}

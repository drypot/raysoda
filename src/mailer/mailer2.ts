import * as fs from 'fs'
import nodemailer, { type Transporter } from 'nodemailer'
import { getConfig, getObject, registerObjectFactory } from '../oman/oman.js'
import Mail from 'nodemailer/lib/mailer/index.js'

registerObjectFactory('Mailer', async () => {
  return Mailer.from(getConfig().mailServerConfigPath)
})

export async function getMailer() {
  return await getObject('Mailer') as Mailer
}

export class Mailer {

  private transport: Transporter | undefined

  static from(configPath: string) {
    return new Mailer(configPath)
  }

  private constructor(configPath: string) {
    this.loadConfig(configPath)
  }

  // port 25:  Authentication 이 없어도 된다. 서버간 통신에 사용.
  // port 587: Authentication 과정이 필수로 발생한다.
  // 개발중에는 25번 포트를 쓰도록 한다.

  loadConfig(configPath: string) {
    if (configPath) {
      const text = fs.readFileSync(configPath, 'utf8')
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

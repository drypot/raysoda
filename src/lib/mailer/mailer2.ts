import * as fs from 'fs'
import nodemailer, { createTransport } from 'nodemailer'
import { Config } from '../config/config.js'
import Mail from 'nodemailer/lib/mailer'

export class Mailer {
  private config: Config
  private transport: ReturnType<typeof createTransport> | undefined

  constructor(config: Config) {
    this.config = config
  }

  initTransport() {
    if (this.config.mailServer === 'aws') {
      const data = fs.readFileSync('config-live/ses-smtp-user.json', 'utf8')
      this.transport = nodemailer.createTransport(JSON.parse(data))
    } else if (this.config.mailServer) {
      this.transport = nodemailer.createTransport({
        host: this.config.mailServer,
        port: 587
      })
    }
  }

  sendMail(opt: Mail.Options, done: (err: (Error | null)) => void) {
    if (this.transport) {
      return this.transport.sendMail(opt, done)
    }
    done(new Error('Transport not initialized.'))
  }
}

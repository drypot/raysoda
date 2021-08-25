import { UserDB } from '../../db/user/user-db.js'
import { PwResetDB, PwResetRecord } from '../../db/pwreset/pwreset-db.js'
import { FormError, INVALID_DATA } from '../../lib/base/error2.js'
import { checkPasswordFormat, EMAIL_NOT_FOUND, EMAIL_PATTERN } from './form/user-form.js'
import crypto from 'crypto'
import { v4 as uuid } from 'uuid'
import { Mailer } from '../../lib/mailer/mailer2.js'
import { makeHash } from '../../lib/base/hash.js'
import { emailPatternIsOk } from '../../lib/base/email.js'

export async function pwResetSendMailService(
  mailer: Mailer, udb: UserDB, resetDB: PwResetDB, email: string, errs: FormError[]
) {
  if (!emailPatternIsOk(email)) {
    errs.push(EMAIL_PATTERN)
    return false
  }
  const user = await udb.findUserByEmail(email)
  if (!user) {
    errs.push(EMAIL_NOT_FOUND)
    return false
  }
  await resetDB.deleteByEmail(email)
  const token = await new Promise<string>((resolve, reject) => {
    crypto.randomBytes(32, function (err, buf) {
      if (err) return reject(err)
      resolve(buf.toString('hex'))
    })
  })
  // uuid 까지 쓴 것은 좀 과하지 않나 싶다.
  // 다른 시스템에서는 좀 간단히 하는 것으로.
  const r: PwResetRecord = {
    uuid: uuid(),
    email,
    token
  }
  await resetDB.insert(r)
  const config = mailer.config
  const mail = {
    from: 'no-reply@raysoda.com',
    to: email,
    subject: 'Reset Password - ' + config.appName,
    text:
      '\n' +
      'Open the following URL to reset your password.\n\n' +
      config.mainUrl + '/user/password-reset-3?uuid=' + r.uuid + '&t=' + r.token + '\n\n' +
      config.appName
  }
  return mailer.sendMail(mail)
}

export interface NewPasswordForm {
  uuid: string
  token: string
  password: string
}

export async function pwResetSetPasswordService(
  udb: UserDB, resetDB: PwResetDB, form: NewPasswordForm, errs: FormError[]
) {
  checkPasswordFormat(form.password, errs)
  if (errs.length) return
  const r = await resetDB.findByUuid(form.uuid)
  if (!r) {
    errs.push(INVALID_DATA)
    return
  }
  if (r.token !== form.token) {
    errs.push(INVALID_DATA)
    return
  }
  const hash = await makeHash(form.password)
  await udb.updateHash(r.email, hash)
  await udb.getRecachedByEmail(r.email)
  await resetDB.deleteByEmail(r.email)
}

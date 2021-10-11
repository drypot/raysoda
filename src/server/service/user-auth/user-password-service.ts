import { UserDB } from '../../db/user/user-db'
import { ResetDB } from '../../db/password/reset-db'
import { checkPasswordFormat } from '../user/_user-service'
import crypto from 'crypto'
import { v4 as uuid } from 'uuid'
import { Mailer } from '../../mailer/mailer2'
import { makeHash } from '../../_util/hash'
import { emailPatternIsOk } from '../../_util/email'
import { ErrorConst, INVALID_DATA } from '../../_type/error'
import { EMAIL_NOT_FOUND, EMAIL_PATTERN } from '../../_type/error-user'
import { UserCache } from '../../db/user/cache/user-cache'
import { NewPasswordForm, ResetToken } from '../../_type/password'

export async function userSendResetPasswordMailService(
    mailer: Mailer, udb: UserDB, resetDB: ResetDB, email: string, err: ErrorConst[]
) {
  if (!emailPatternIsOk(email)) {
    err.push(EMAIL_PATTERN)
    return false
  }
  const user = await udb.findUserByEmail(email)
  if (!user) {
    err.push(EMAIL_NOT_FOUND)
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
  const r: ResetToken = {
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
      config.mainUrl + '/user-password-reset-3?uuid=' + r.uuid + '&t=' + r.token + '\n\n' +
      config.appName
  }
  return mailer.sendMail(mail)
}

export async function userResetPasswordService(
    uc: UserCache, resetDB: ResetDB, form: NewPasswordForm, err: ErrorConst[]
) {
  checkPasswordFormat(form.password, err)
  if (err.length) return
  const r = await resetDB.findByUuid(form.uuid)
  if (!r) {
    err.push(INVALID_DATA)
    return
  }
  if (r.token !== form.token) {
    err.push(INVALID_DATA)
    return
  }
  const hash = await makeHash(form.password)
  await uc.udb.updateHash(r.email, hash)
  await uc.getCachedByEmailForce(r.email)
  await resetDB.deleteByEmail(r.email)
}

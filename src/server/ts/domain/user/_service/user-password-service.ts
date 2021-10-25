import { v4 as uuid } from 'uuid'
import { NewPasswordForm, ResetToken } from '@common/type/password'
import { checkPasswordFormat } from '@server/domain/user/_service/_user-service'
import { Mailer } from '@server/mailer/mailer2'
import { EMAIL_NOT_FOUND, EMAIL_PATTERN, INVALID_DATA } from '@common/type/error-const'
import { emailPatternIsOk } from '@common/util/email'
import * as crypto from 'crypto'
import { ErrorConst } from '@common/type/error'
import { ResetDB } from '@server/db/password/reset-db'
import { makeHash } from '@common/util/hash'
import { UserDB } from '@server/db/user/user-db'
import { omanGetConfig } from '@server/oman/oman'

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

  const config = omanGetConfig()
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
    udb: UserDB, resetDB: ResetDB, form: NewPasswordForm, err: ErrorConst[]
) {

  checkPasswordFormat(form.password, err)
  if (err.length) {
    return
  }

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

  await udb.updateHash(r.email, hash)
  await resetDB.deleteByEmail(r.email)

}

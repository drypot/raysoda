import { NewPasswordForm } from '@common/type/password'
import { userCheckPassword } from '@server/domain/user/_service/_user-check'
import { Mailer } from '@server/mailer/mailer2'
import { EMAIL_NOT_FOUND, EMAIL_PATTERN, INVALID_DATA, PASSWORD_RESET_TIMEOUT } from '@common/type/error-const'
import { emailPatternIsOk } from '@common/util/email'
import { randomBytes } from 'crypto'
import { ErrorConst } from '@common/type/error'
import { PwMailDB } from '@server/db/password/pwmail-db'
import { makeHash } from '@common/util/hash'
import { UserDB } from '@server/db/user/user-db'
import { omanGetConfig } from '@server/oman/oman'
import { dateDiffMins } from '@common/util/date2'

export async function userPasswordMail(
  mailer: Mailer, udb: UserDB, rdb: PwMailDB, email: string, err: ErrorConst[]
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

  const id = rdb.getNextId()
  const random = randomBytes(16).toString('hex')
  const cdate = new Date()

  await rdb.deleteByEmail(email)
  await rdb.insert({ id, email, random, cdate })

  const config = omanGetConfig()
  const mail = {
    from: 'no-reply@raysoda.com',
    to: email,
    subject: 'Reset Password - ' + config.appName,
    text:
      '\n' +
      'Open the following URL to reset your password.\n\n' +
      config.mainUrl + '/user-password-reset/' + id + '/' + random + '\n\n' +
      config.appName
  }

  return mailer.sendMail(mail)
}

export async function userPasswordReset(
  udb: UserDB, rdb: PwMailDB, form: NewPasswordForm, err: ErrorConst[]
) {
  const id = form.id
  const random = form.random
  const password = form.password

  userCheckPassword(password, err)
  if (err.length) {
    return
  }

  const r = await rdb.findById(id)
  if (!r) {
    err.push(INVALID_DATA)
    return
  }
  if (r.random !== random) {
    err.push(INVALID_DATA)
    return
  }
  if (dateDiffMins(new Date(), r.cdate) > 5) {
    err.push(PASSWORD_RESET_TIMEOUT)
    return
  }

  const email = r.email
  const hash = await makeHash(password)
  await udb.updateHash(email, hash)

  await rdb.deleteByEmail(email)
}

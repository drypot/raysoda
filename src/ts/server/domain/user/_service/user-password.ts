import { NewPasswordForm } from '@common/type/password'
import { checkUserPassword } from '@server/domain/user/_service/_user-check'
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

export async function mailUserPassword(
  mailer: Mailer, udb: UserDB, mdb: PwMailDB, email: string, err: ErrorConst[]
) {
  if (!emailPatternIsOk(email)) {
    err.push(EMAIL_PATTERN)
    return false
  }

  const user = await udb.getUserByEmail(email)
  if (!user) {
    err.push(EMAIL_NOT_FOUND)
    return false
  }

  const id = mdb.getNextId()
  const random = randomBytes(16).toString('hex')
  const cdate = new Date()

  await mdb.deleteLogByEmail(email)
  await mdb.insertLog({ id, email, random, cdate })

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

export async function resetUserPassword(
  udb: UserDB, mdb: PwMailDB, form: NewPasswordForm, err: ErrorConst[]
) {
  const id = form.id
  const random = form.random
  const password = form.password

  checkUserPassword(password, err)
  if (err.length) {
    return
  }

  const r = await mdb.getLogById(id)
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
  await udb.updateUserByEmail(email, { hash })

  await mdb.deleteLogByEmail(email)
}

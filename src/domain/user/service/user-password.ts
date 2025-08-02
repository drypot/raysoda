import { Mailer } from '../../../mailer/mailer2.js'
import { UserDB } from '../../../db/user/user-db.js'
import { PwMailDB } from '../../../db/password/pwmail-db.js'
import { ErrorConst } from '../../../common/type/error.js'
import { emailPatternIsOk } from '../../../common/util/email.js'
import {
  EMAIL_NOT_FOUND,
  EMAIL_PATTERN,
  INVALID_DATA,
  PASSWORD_RESET_TIMEOUT
} from '../../../common/type/error-const.js'
import { randomBytes } from 'node:crypto'
import { getConfig } from '../../../oman/oman.js'
import { NewPasswordForm } from '../../../common/type/password.js'
import { checkUserPassword } from './user-check.js'
import { dateDiffMins } from '../../../common/util/date2.js'
import { makeHash } from '../../../common/util/hash.js'

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

  const config = getConfig()
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

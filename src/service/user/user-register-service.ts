import {
  checkEmailDupe,
  checkEmailFormat,
  checkHomeDupe,
  checkHomeFormat,
  checkNameDupe,
  checkNameFormat,
  checkPasswordFormat,
  UserRegisterForm
} from './_user-service.js'
import { userOf } from '../../core/user.js'
import { Error2 } from '../../_error/error2.js'
import { UserDB } from '../../db/user/user-db.js'
import { makeHash } from '../../_util/hash.js'

export async function userRegisterService(udb: UserDB, form: UserRegisterForm, err: Error2[]) {
  checkNameFormat(form.name, err)
  checkHomeFormat(form.name, err)
  checkEmailFormat(form.email, err)
  checkPasswordFormat(form.password, err)
  await checkNameDupe(udb, 0, form.name, err)
  await checkHomeDupe(udb, 0, form.name, err)
  await checkEmailDupe(udb, 0, form.email, err)
  if (err.length) return
  const now = new Date()
  const user = userOf({
    id: udb.getNextUserId(),
    name: form.name,
    home: form.name,
    email: form.email,
    hash: await makeHash(form.password),
    profile: '',
    cdate: now,
    adate: now,
    pdate: new Date(2000, 0, 1)
  })
  await udb.insertUser(user)
  return user
}

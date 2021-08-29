import {
  checkEmailDupe,
  checkEmailFormat,
  checkHomeDupe,
  checkHomeFormat,
  checkNameDupe,
  checkNameFormat,
  checkPasswordFormat,
  UserRegisterForm
} from './form/user-form.js'
import { userOf } from '../../entity/user-entity.js'
import { FormError } from '../../lib/base/error2.js'
import { UserDB } from '../../db/user/user-db.js'
import { makeHash } from '../../lib/base/hash.js'

export async function userRegisterService(udb: UserDB, form: UserRegisterForm, errs: FormError[]) {
  checkNameFormat(form.name, errs)
  checkHomeFormat(form.name, errs)
  checkEmailFormat(form.email, errs)
  checkPasswordFormat(form.password, errs)
  await checkNameDupe(udb, 0, form.name, errs)
  await checkHomeDupe(udb, 0, form.name, errs)
  await checkEmailDupe(udb, 0, form.email, errs)
  if (errs.length) return
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

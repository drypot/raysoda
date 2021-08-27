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
  if (errs.length > 0) return
  const user = userOf()
  user.id = udb.getNextUserId()
  user.name = form.name
  user.home = form.name
  user.email = form.email
  user.profile = ''
  user.hash = await makeHash(form.password)
  await udb.insertUser(user)
  return user
}

import {
  checkEmailDB,
  checkEmailFormat,
  checkHomeDB,
  checkHomeFormat,
  checkNameDB,
  checkNameFormat,
  checkPasswordFormat,
  UserForm
} from './form/user-form.js'
import { userOf } from './entity/user-entity.js'
import { FormError } from '../../lib/base/error2.js'
import { UserDB } from '../../db/user/user-db.js'
import { makeHash } from '../../lib/base/hash.js'

export async function userRegisterService(udb: UserDB, form: UserForm, errs: FormError[]) {
  checkNameFormat(form.name, errs)
  checkHomeFormat(form.home, errs)
  checkEmailFormat(form.email, errs)
  checkPasswordFormat(form.password, errs)
  await checkNameDB(udb, 0, form.name, errs)
  await checkHomeDB(udb, 0, form.home, errs)
  await checkEmailDB(udb, 0, form.email, errs)
  if (errs.length > 0) return
  const user = userOf()
  user.id = udb.getNextUserId()
  user.name = form.name
  user.home = form.home
  user.email = form.email
  user.profile = form.profile
  user.hash = await makeHash(form.password)
  await udb.insertUser(user)
  return user
}
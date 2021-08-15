import {
  checkEmailFormat,
  checkEmailUsable,
  checkHomeFormat,
  checkHomeUsable,
  checkNameFormat,
  checkNameUsable,
  checkPasswordFormat, USER_NOT_FOUND,
  UserForm
} from '../form/user-form.js'
import { newUser } from '../entity/user-entity.js'
import { FormError } from '../../../lib/base/error2.js'
import { UserDB } from '../db/user-db.js'
import { makePasswordHash } from '../entity/user-password.js'

export async function registerUser(udb: UserDB, form: UserForm, errs: FormError[]) {
  checkNameFormat(form.name, errs)
  checkHomeFormat(form.home, errs)
  checkEmailFormat(form.email, errs)
  checkPasswordFormat(form.password, errs)
  await checkNameUsable(udb, 0, form.name, errs)
  await checkHomeUsable(udb, 0, form.home, errs)
  await checkEmailUsable(udb, 0, form.email, errs)
  if (errs.length > 0) return
  const user = newUser()
  user.id = udb.getNextUserId()
  user.name = form.name
  user.home = form.home
  user.email = form.email
  user.profile = form.profile
  user.hash = await makePasswordHash(form.password)
  await udb.insertUser(user)
  return user
}

export async function deactivateUser(udb: UserDB, id: number, errs: FormError[]) {
  const r = await udb.deactivateUser(id)
  if (!r.changedRows) {
    errs.push(USER_NOT_FOUND)
    return
  }
  udb.deleteCache(id)
}

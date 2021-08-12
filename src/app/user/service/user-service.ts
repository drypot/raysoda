import {
  checkUserEmail,
  checkUserEmailUsable,
  checkUserHome,
  checkUserHomeUsable,
  checkUserName,
  checkUserNameUsable,
  checkUserPassword,
  UserForm
} from '../form/user-form.js'
import { newUser } from '../entity/user-entity.js'
import { FormError } from '../../../lib/base/error2.js'
import { UserDB } from '../db/user-db.js'
import { makePasswordHash } from './user-service-hash.js'

export async function addUserService(userdb: UserDB, form: UserForm) {
  const errs = [] as FormError[]
  checkUserName(form.name, errs)
  checkUserHome(form.home, errs)
  checkUserEmail(form.email, errs)
  checkUserPassword(form.password, errs)
  await checkUserNameUsable(userdb, 0, form.name, errs)
  await checkUserHomeUsable(userdb, 0, form.home, errs)
  await checkUserEmailUsable(userdb, 0, form.email, errs)
  if (errs.length > 0) throw errs

  const user = newUser()
  user.id = userdb.getNextUserId()
  user.name = form.name
  user.home = form.home
  user.email = form.email
  user.profile = form.profile
  const hash = await makePasswordHash(form.password)
  user.hash = hash
  await userdb.insertUser(user)
  return user
}

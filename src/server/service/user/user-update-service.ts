import { User } from '../../_type/user'
import {
  checkEmailDupe,
  checkEmailFormat,
  checkHomeDupe,
  checkHomeFormat,
  checkNameDupe,
  checkNameFormat,
  checkPasswordFormat
} from './_user-service'
import { makeHash } from '../../_util/hash'
import { ErrorConst } from '../../_type/error'
import { newUserUpdateForm, UserUpdateForm } from '../../_type/user-form'
import { userCanUpdateUser } from '../user-auth/user-auth-service'
import { NOT_AUTHORIZED, USER_NOT_FOUND } from '../../_type/error-const'
import { UserDB } from '../../db/user/user-db'

export async function checkUserUpdatable(udb: UserDB, user: User, user2: User | undefined, err: ErrorConst[]) {
  if (!user2) {
    err.push(USER_NOT_FOUND)
    return
  }
  if (!userCanUpdateUser(user, user2.id)) {
    err.push(NOT_AUTHORIZED)
    return
  }
}

export async function userUpdateGetService(udb: UserDB, user: User, id: number, err: ErrorConst[]) {
  const user2 = await udb.getCachedById(id)
  await checkUserUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }
  return newUserUpdateForm(user2)
}

export async function userUpdateService(udb: UserDB, user: User, id: number, form: UserUpdateForm, err: ErrorConst[]) {
  const user2 = await udb.getCachedById(id)
  await checkUserUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }

  checkNameFormat(form.name, err)
  checkHomeFormat(form.home, err)
  checkEmailFormat(form.email, err)
  if (form.password) {
    checkPasswordFormat(form.password, err)
  }
  await checkNameDupe(udb, id, form.name, err)
  await checkHomeDupe(udb, id, form.home, err)
  await checkEmailDupe(udb, id, form.email, err)
  if (err.length > 0) {
    return
  }

  let update: Partial<User> = {
    name: form.name,
    home: form.home,
    email: form.email,
    profile: form.profile
  }
  if (form.password.length) {
    update.hash = await makeHash(form.password)
  }
  await udb.updateUser(id, update)
}

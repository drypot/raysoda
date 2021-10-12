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
import { UserCache } from '../../db/user/cache/user-cache'
import { ErrorConst } from '../../_type/error'
import { newUserUpdateForm, UserUpdateForm } from '../../_type/user-form'
import { userCanUpdateUser } from '../user-auth/user-auth-service'
import { NOT_AUTHORIZED, USER_NOT_FOUND } from '../../_type/error-const'

export async function checkUserUpdatable(uc: UserCache, user: User, id: number, err: ErrorConst[]) {
  const user2 = await uc.getCachedById(id)
  if (!user2) {
    err.push(USER_NOT_FOUND)
    return
  }
  if (!userCanUpdateUser(user, id)) {
    err.push(NOT_AUTHORIZED)
    return
  }
  return user2
}

export async function userUpdateGetService(uc: UserCache, user: User, id: number, err: ErrorConst[]) {
  const user2 = await checkUserUpdatable(uc, user, id, err)
  if (!user2 || err.length) {
    return
  }
  return newUserUpdateForm(user2)
}

export async function userUpdateService(uc: UserCache, user: User, id: number, form: UserUpdateForm, err: ErrorConst[]) {
  const user2 = await checkUserUpdatable(uc, user, id, err)
  if (!user2 || err.length) {
    return
  }

  const udb = uc.udb
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
  uc.deleteCacheById(id)
}

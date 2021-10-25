import { NOT_AUTHORIZED, USER_NOT_FOUND } from '@common/type/error-const'
import { User } from '@common/type/user'
import {
  checkEmailDupe,
  checkEmailFormat,
  checkHomeDupe,
  checkHomeFormat,
  checkNameDupe,
  checkNameFormat,
  checkPasswordFormat
} from '@server/domain/user/_service/_user-service'
import { newUserUpdateForm, UserUpdateForm } from '@common/type/user-form'
import { ErrorConst } from '@common/type/error'
import { userCanUpdateUser } from '@server/domain/user/_service/user-auth-service'
import { makeHash } from '@common/util/hash'
import { UserDB } from '@server/db/user/user-db'

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

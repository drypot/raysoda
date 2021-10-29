import { NOT_AUTHORIZED, USER_NOT_FOUND } from '@common/type/error-const'
import { User } from '@common/type/user'
import {
  userCheckEmail,
  userCheckEmailDupe,
  userCheckHome,
  userCheckHomeDupe,
  userCheckName,
  userCheckNameDupe,
  userCheckPassword
} from '@server/domain/user/_service/_user-check'
import { newUserUpdateForm, UserUpdateForm, UserUpdateStatusForm } from '@common/type/user-form'
import { ErrorConst } from '@common/type/error'
import { userCanUpdateUser } from '@server/domain/user/_service/user-auth'
import { makeHash } from '@common/util/hash'
import { UserDB } from '@server/db/user/user-db'

export async function userCheckUpdatable(udb: UserDB, user: User, user2: User | undefined, err: ErrorConst[]) {
  if (!user2) {
    err.push(USER_NOT_FOUND)
    return
  }
  if (!userCanUpdateUser(user, user2.id)) {
    err.push(NOT_AUTHORIZED)
    return
  }
}

export async function userGetForUpdate(udb: UserDB, user: User, id: number, err: ErrorConst[]) {
  const user2 = await udb.getCachedById(id)
  await userCheckUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }
  return newUserUpdateForm(user2)
}

export async function userUpdate(udb: UserDB, user: User, form: UserUpdateForm, err: ErrorConst[]) {
  const { id, name, home, email, password, profile } = form

  const user2 = await udb.getCachedById(id)
  await userCheckUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }

  userCheckName(name, err)
  userCheckHome(home, err)
  userCheckEmail(email, err)
  if (password) {
    userCheckPassword(password, err)
  }
  await userCheckNameDupe(udb, id, name, err)
  await userCheckHomeDupe(udb, id, home, err)
  await userCheckEmailDupe(udb, id, email, err)
  if (err.length > 0) {
    return
  }

  let update: Partial<User> = { name, home, email, profile }
  if (password.length) {
    update.hash = await makeHash(password)
  }
  await udb.updateUser(id, update)
}

export async function userUpdateStatus(udb: UserDB, user: User, form: UserUpdateStatusForm, err: ErrorConst[]) {
  const { id, status } = form
  const user2 = await udb.getCachedById(id)
  await userCheckUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }
  await udb.updateStatus(id, status)
}

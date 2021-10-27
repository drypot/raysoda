import { INVALID_DATA, NOT_AUTHORIZED, USER_NOT_FOUND } from '@common/type/error-const'
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
import { newUserUpdateForm, UserUpdateForm } from '@common/type/user-form'
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

export async function userUpdate(udb: UserDB, user: User, id: number, form: UserUpdateForm, err: ErrorConst[]) {
  const user2 = await udb.getCachedById(id)
  await userCheckUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }

  userCheckName(form.name, err)
  userCheckHome(form.home, err)
  userCheckEmail(form.email, err)
  if (form.password) {
    userCheckPassword(form.password, err)
  }
  await userCheckNameDupe(udb, id, form.name, err)
  await userCheckHomeDupe(udb, id, form.home, err)
  await userCheckEmailDupe(udb, id, form.email, err)
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

export async function userUpdateStatus(udb: UserDB, user: User, id: number, status: string, err: ErrorConst[]) {
  const user2 = await udb.getCachedById(id)
  await userCheckUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }
  if (status === 'v' || status === 'd') {
    await udb.updateStatus(id, status)
    return
  }
  err.push(INVALID_DATA)
}

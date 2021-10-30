import { EMAIL_DUPE, HOME_DUPE, NAME_DUPE, NOT_AUTHORIZED, USER_NOT_FOUND } from '@common/type/error-const'
import { User } from '@common/type/user'
import {
  userCheckEmail,
  userCheckHome,
  userCheckName,
  userCheckPassword
} from '@server/domain/user/_service/_user-check'
import { UserUpdateForm, UserUpdatePasswordForm, UserUpdateStatusForm } from '@common/type/user-form'
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

export async function userGetForUpdate(
  udb: UserDB, user: User, id: number, err: ErrorConst[]) {

  const user2 = await udb.getCachedById(id)
  await userCheckUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }

  const user3: UserUpdateForm = {
    id: user2.id,
    name: user2.name,
    home: user2.home,
    email: user2.email,
    profile: user2.profile,
  }

  return user3
}

export async function userUpdate(udb: UserDB, user: User, form: UserUpdateForm, err: ErrorConst[]) {
  const { id, name, home, email, profile } = form

  const user2 = await udb.getCachedById(id)
  await userCheckUpdatable(udb, user, user2, err)
  if (!user2 || err.length) return

  userCheckName(name, err)
  userCheckHome(home, err)
  userCheckEmail(email, err)
  await userCheckNameDupe(udb, id, name, err)
  await userCheckHomeDupe(udb, id, home, err)
  await userCheckEmailDupe(udb, id, email, err)
  if (err.length > 0) return

  await udb.updateUserById(id, { name, home, email, profile })
}

async function userCheckEmailDupe(udb: UserDB, id: number, email: string, err: ErrorConst[]) {
  const user = await udb.findUserByEmail(email)
  if (!user) return
  if (user.id === id) return
  err.push(EMAIL_DUPE)
}

async function userCheckNameDupe(udb: UserDB, id: number, name: string, err: ErrorConst[]) {
  const user = await udb.findUserByName(name)
  if (!user) return
  if (user.id === id) return
  err.push(NAME_DUPE)
}

async function userCheckHomeDupe(udb: UserDB, id: number, home: string, err: ErrorConst[]) {
  const user = await udb.findUserByHome(home)
  if (!user) return
  if (user.id === id) return
  err.push(HOME_DUPE)
}

export async function userUpdatePassword(udb: UserDB, user: User, form: UserUpdatePasswordForm, err: ErrorConst[]) {
  const { id, password } = form

  const user2 = await udb.getCachedById(id)
  await userCheckUpdatable(udb, user, user2, err)
  if (!user2 || err.length) return

  userCheckPassword(password, err)
  if (err.length > 0) return

  const hash = await makeHash(password)
  await udb.updateUserById(id, { hash })
}

export async function userUpdateStatus(udb: UserDB, user: User, form: UserUpdateStatusForm, err: ErrorConst[]) {
  const { id, status } = form

  const user2 = await udb.getCachedById(id)
  await userCheckUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }

  await udb.updateUserById(id, { status })
}

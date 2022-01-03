import { EMAIL_DUPE, HOME_DUPE, NAME_DUPE, NOT_AUTHORIZED, USER_NOT_FOUND } from '@common/type/error-const'
import { User } from '@common/type/user'
import {
  checkUserEmail,
  checkUserHome,
  checkUserName,
  checkUserPassword
} from '@server/domain/user/_service/_user-check'
import { UpdateUserPasswordForm, UpdateUserProfileForm, UpdateUserStatusForm } from '@common/type/user-form'
import { ErrorConst } from '@common/type/error'
import { userCanUpdateUser } from '@server/domain/user/_service/user-auth'
import { makeHash } from '@common/util/hash'
import { UserDB } from '@server/db/user/user-db'

export async function getUserForUpdateProfile(
  udb: UserDB, user: User, id: number, err: ErrorConst[]) {

  const user2 = await udb.getCachedById(id)
  await checkUserUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }

  const user3: UpdateUserProfileForm = {
    id: user2.id,
    name: user2.name,
    home: user2.home,
    email: user2.email,
    profile: user2.profile,
  }

  return user3
}

export async function updateUserProfile(udb: UserDB, user: User, form: UpdateUserProfileForm, err: ErrorConst[]) {
  const { id, name, home, email, profile } = form

  const user2 = await udb.getCachedById(id)
  await checkUserUpdatable(udb, user, user2, err)
  if (!user2 || err.length) return

  checkUserName(name, err)
  checkUserHome(home, err)
  checkUserEmail(email, err)
  await checkUserNameDupe(udb, id, name, err)
  await checkUserHomeDupe(udb, id, home, err)
  await checkUserEmailDupe(udb, id, email, err)
  if (err.length > 0) return

  await udb.updateUserById(id, { name, home, email, profile })
}

async function checkUserEmailDupe(udb: UserDB, id: number, email: string, err: ErrorConst[]) {
  const user = await udb.getUserByEmail(email)
  if (!user) return
  if (user.id === id) return
  err.push(EMAIL_DUPE)
}

async function checkUserNameDupe(udb: UserDB, id: number, name: string, err: ErrorConst[]) {
  const user = await udb.getUserByName(name)
  if (!user) return
  if (user.id === id) return
  err.push(NAME_DUPE)
}

async function checkUserHomeDupe(udb: UserDB, id: number, home: string, err: ErrorConst[]) {
  const user = await udb.getUserByHome(home)
  if (!user) return
  if (user.id === id) return
  err.push(HOME_DUPE)
}

export async function updateUserPassword(udb: UserDB, user: User, form: UpdateUserPasswordForm, err: ErrorConst[]) {
  const { id, password } = form

  const user2 = await udb.getCachedById(id)
  await checkUserUpdatable(udb, user, user2, err)
  if (!user2 || err.length) return

  checkUserPassword(password, err)
  if (err.length > 0) return

  const hash = await makeHash(password)
  await udb.updateUserById(id, { hash })
}

export async function updateUserStatus(udb: UserDB, user: User, form: UpdateUserStatusForm, err: ErrorConst[]) {
  const { id, status } = form

  const user2 = await udb.getCachedById(id)
  await checkUserUpdatable(udb, user, user2, err)
  if (!user2 || err.length) {
    return
  }

  await udb.updateUserById(id, { status })
}

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

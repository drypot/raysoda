import { Error2 } from '../../../_error/error2.js'
import { UserDB } from '../../../db/user/user-db.js'
import { emailPatternIsOk } from '../../../_util/email.js'
import {
  EMAIL_DUPE,
  EMAIL_EMPTY,
  EMAIL_PATTERN,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_EMPTY,
  HOME_RANGE,
  NAME_DUPE,
  NAME_EMPTY,
  NAME_RANGE,
  PASSWORD_EMPTY,
  PASSWORD_RANGE
} from '../../../_error/error-user.js'

export type UserRegisterForm = {
  name: string
  email: string
  password: string
}

export type UserUpdateForm = {
  name: string
  home: string
  email: string
  password: string
  profile: string
}

export function userRegisterFormOf(params?: Partial<UserRegisterForm>) {
  return {
    name: '',
    email: '',
    password: '',
    ...params
  } as UserRegisterForm
}

export function userUpdateFormOf(params?: Partial<UserUpdateForm>) {
  return {
    name: '',
    home: '',
    email: '',
    password: '',
    profile: '',
    ...params
  } as UserUpdateForm
}

export function checkNameFormat(name: string, err: Error2[]) {
  if (name.length === 0) {
    err.push(NAME_EMPTY)
  } else if (name.length > 32) {
    err.push(NAME_RANGE)
  }
}

export function checkHomeFormat(home: string, err: Error2[]) {
  if (home.length === 0) {
    err.push(HOME_EMPTY)
  } else if (home.length > 32) {
    err.push(HOME_RANGE)
  }
}

export function checkEmailFormat(email: string, err: Error2[]) {
  if (email.length === 0) {
    err.push(EMAIL_EMPTY)
  } else if (email.length > 64 || email.length < 8) {
    err.push(EMAIL_RANGE)
  } else if (!emailPatternIsOk(email)) {
    err.push(EMAIL_PATTERN)
  }
}

export function checkPasswordFormat(password: string, err: Error2[]) {
  if (password.length === 0) {
    err.push(PASSWORD_EMPTY)
  } else if (password.length > 32 || password.length < 4) {
    err.push(PASSWORD_RANGE)
  }
}

export async function checkNameDupe(
  userdb: UserDB, id: number, name: string, err: Error2[]
) {
  if (await userdb.nameIsDupe(id, name)) err.push(NAME_DUPE)
  if (await userdb.homeIsDupe(id, name)) err.push(NAME_DUPE)
}

export async function checkHomeDupe(
  userdb: UserDB, id: number, home: string, err: Error2[]
) {
  if (await userdb.nameIsDupe(id, home)) err.push(HOME_DUPE)
  if (await userdb.homeIsDupe(id, home)) err.push(HOME_DUPE)
}

export async function checkEmailDupe(
  userdb: UserDB, id: number, email: string, err: Error2[]
) {
  if (await userdb.emailIsDupe(id, email)) err.push(EMAIL_DUPE)
}

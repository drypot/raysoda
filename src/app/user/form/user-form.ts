import { Request } from 'express'
import { FormError, newFormError } from '../../../lib/base/error2.js'
import { UserDB } from '../db/user-db.js'

export const NOT_AUTHENTICATED = newFormError('NOT_AUTHENTICATED', '먼저 로그인해 주십시오.')
export const NOT_AUTHORIZED = newFormError('NOT_AUTHORIZED', '사용 권한이 없습니다.')
export const USER_NOT_FOUND = newFormError('USER_NOT_FOUND', '사용자를 찾을 수 없습니다.')
export const EMAIL_NOT_FOUND = newFormError('EMAIL_NOT_FOUND', '등록되지 않은 이메일입니다.', 'email')
export const ACCOUNT_DEACTIVATED = newFormError('ACCOUNT_DEACTIVATED', '사용중지된 계정입니다.', 'email')
export const PASSWORD_WRONG = newFormError('PASSWORD_WRONG', '비밀번호가 틀렸습니다.', 'password')

export const NAME_EMPTY = newFormError('NAME_EMPTY', '이름을 입력해 주십시오.', 'name')
export const NAME_RANGE = newFormError('NAME_RANGE', '이름 길이는 1 ~ 32 글자입니다.', 'name')
export const NAME_DUPE = newFormError('NAME_DUPE', '이미 등록되어 있는 이름입니다.', 'name')

export const HOME_EMPTY = newFormError('HOME_EMPTY', '개인 주소를 입력해 주십시오.', 'home')
export const HOME_RANGE = newFormError('HOME_RANGE', '개인 주소 길이는 1 ~ 32 글자입니다.', 'home')
export const HOME_DUPE = newFormError('HOME_DUPE', '이미 등록되어 있는 개인 주소입니다.', 'home')

export const EMAIL_EMPTY = newFormError('EMAIL_EMPTY', '이메일 주소를 입력해 주십시오.', 'email')
export const EMAIL_RANGE = newFormError('EMAIL_RANGE', '이메일 주소 길이는 8 ~ 64 글자입니다.', 'email')
export const EMAIL_PATTERN = newFormError('EMAIL_PATTERN', '이메일 형식이 잘못되었습니다.', 'email')
export const EMAIL_DUPE = newFormError('EMAIL_DUPE', '이미 등록되어 있는 이메일입니다.', 'email')

export const PASSWORD_EMPTY = newFormError('PASSWORD_EMPTY', '비밀번호를 입력해 주십시오.', 'password')
export const PASSWORD_RANGE = newFormError('PASSWORD_RANGE', '비밀번호 길이는 4 ~ 32 글자입니다.', 'password')

export const EMAIL_NOT_EXIST = newFormError('EMAIL_NOT_EXIST', '등록되지 않은 이메일입니다.', 'email')
export const RESET_TIMEOUT = newFormError('RESET_TIMEOUT', '비밀번호 초기화 토큰 유효시간이 지났습니다.')

export interface UserForm {
  id: number
  name: string
  home: string
  email: string
  password: string
  profile: string
}

export function newUserForm(params?: Object): UserForm {
  return {
    id: 0,
    name: '',
    home: '',
    email: '',
    password: '',
    profile: '',
    ...params
  }
}

export function getUserForm(req: Request): UserForm {
  const body = req.body
  return {
    id: 0,
    name: String(body.name ?? '').trim(),
    home: String(body.home ?? '').trim(),
    email: String(body.email ?? '').trim(),
    password: String(body.password ?? '').trim(),
    profile: String(body.profile ?? '').trim(),
  }
}

const emailPattern = /^[a-z0-9-_+.]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i

export function checkUserName(name: string, errors: FormError[]) {
  if (name.length === 0) {
    errors.push(NAME_EMPTY)
  } else if (name.length > 32) {
    errors.push(NAME_RANGE)
  }
}

export function checkUserHome(home: string, errors: FormError[]) {
  if (home.length === 0) {
    errors.push(HOME_EMPTY)
  } else if (home.length > 32) {
    errors.push(HOME_RANGE)
  }
}

export function checkUserEmail(email: string, errors: FormError[]) {
  if (email.length === 0) {
    errors.push(EMAIL_EMPTY)
  } else if (email.length > 64 || email.length < 8) {
    errors.push(EMAIL_RANGE)
  } else if (!emailPattern.test(email)) {
    errors.push(EMAIL_PATTERN)
  }
}

export function checkUserPassword(password: string, errors: FormError[]) {
  if (password.length === 0) {
    errors.push(PASSWORD_EMPTY)
  } else if (password.length > 32 || password.length < 4) {
    errors.push(PASSWORD_RANGE)
  }
}

export async function checkUserNameUsable(userdb: UserDB, id: number, name: string, errors: FormError[]): Promise<void> {
  let usable: boolean
  usable = await userdb.checkNameUsable(id, name)
  if (!usable) errors.push(NAME_DUPE)
  usable = await userdb.checkHomeUsable(id, name)
  if (!usable) errors.push(NAME_DUPE)
}

export async function checkUserHomeUsable(userdb: UserDB, id: number, home: string, errors: FormError[]): Promise<void> {
  let usable: boolean
  usable = await userdb.checkNameUsable(id, home)
  if (!usable) errors.push(HOME_DUPE)
  usable = await userdb.checkHomeUsable(id, home)
  if (!usable) errors.push(HOME_DUPE)
}

export async function checkUserEmailUsable(userdb: UserDB, id: number, email: string, errors: FormError[]): Promise<void> {
  const usable = await userdb.checkEmailUsable(id, email)
  if (!usable) errors.push(EMAIL_DUPE)
}

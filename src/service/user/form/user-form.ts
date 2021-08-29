import { Error2, errorOf } from '../../../lib/base/error2.js'
import { UserDB } from '../../../db/user/user-db.js'
import { emailPatternIsOk } from '../../../lib/base/email.js'

export const NOT_AUTHENTICATED = errorOf('NOT_AUTHENTICATED', '먼저 로그인해 주십시오.')
export const NOT_AUTHORIZED = errorOf('NOT_AUTHORIZED', '사용 권한이 없습니다.')
export const USER_NOT_FOUND = errorOf('USER_NOT_FOUND', '사용자를 찾을 수 없습니다.')
export const EMAIL_NOT_FOUND = errorOf('EMAIL_NOT_FOUND', '등록되지 않은 이메일입니다.', 'email')
export const ACCOUNT_DEACTIVATED = errorOf('ACCOUNT_DEACTIVATED', '사용중지된 계정입니다.', 'email')
export const PASSWORD_WRONG = errorOf('PASSWORD_WRONG', '비밀번호가 틀렸습니다.', 'password')

export const NAME_EMPTY = errorOf('NAME_EMPTY', '이름을 입력해 주십시오.', 'name')
export const NAME_RANGE = errorOf('NAME_RANGE', '이름 길이는 1 ~ 32 글자입니다.', 'name')
export const NAME_DUPE = errorOf('NAME_DUPE', '이미 등록되어 있는 이름입니다.', 'name')

export const HOME_EMPTY = errorOf('HOME_EMPTY', '개인 주소를 입력해 주십시오.', 'home')
export const HOME_RANGE = errorOf('HOME_RANGE', '개인 주소 길이는 1 ~ 32 글자입니다.', 'home')
export const HOME_DUPE = errorOf('HOME_DUPE', '이미 등록되어 있는 개인 주소입니다.', 'home')

export const EMAIL_EMPTY = errorOf('EMAIL_EMPTY', '이메일 주소를 입력해 주십시오.', 'email')
export const EMAIL_RANGE = errorOf('EMAIL_RANGE', '이메일 주소 길이는 8 ~ 64 글자입니다.', 'email')
export const EMAIL_PATTERN = errorOf('EMAIL_PATTERN', '이메일 형식이 잘못되었습니다.', 'email')
export const EMAIL_DUPE = errorOf('EMAIL_DUPE', '이미 등록되어 있는 이메일입니다.', 'email')

export const PASSWORD_EMPTY = errorOf('PASSWORD_EMPTY', '비밀번호를 입력해 주십시오.', 'password')
export const PASSWORD_RANGE = errorOf('PASSWORD_RANGE', '비밀번호 길이는 4 ~ 32 글자입니다.', 'password')

export const RESET_TIMEOUT = errorOf('RESET_TIMEOUT', '비밀번호 초기화 토큰 유효시간이 지났습니다.')

export interface UserRegisterForm {
  name: string
  email: string
  password: string
}

export interface UserUpdateForm {
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

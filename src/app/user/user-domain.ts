import { FormError } from '../../lib/base/error2.js'
import bcryptjs from 'bcryptjs'

export const NOT_AUTHENTICATED = new FormError('NOT_AUTHENTICATED', '먼저 로그인해 주십시오.')
export const NOT_AUTHORIZED = new FormError('NOT_AUTHORIZED', '사용 권한이 없습니다.')
export const USER_NOT_FOUND = new FormError('USER_NOT_FOUND', '사용자를 찾을 수 없습니다.')
export const EMAIL_NOT_FOUND = new FormError('EMAIL_NOT_FOUND', '등록되지 않은 이메일입니다.', 'email')
export const ACCOUNT_DEACTIVATED = new FormError('ACCOUNT_DEACTIVATED', '사용중지된 계정입니다.', 'email')
export const PASSWORD_WRONG = new FormError('PASSWORD_WRONG', '비밀번호가 틀렸습니다.', 'password')

export const NAME_EMPTY = new FormError('NAME_EMPTY', '이름을 입력해 주십시오.', 'name')
export const NAME_RANGE = new FormError('NAME_RANGE', '이름 길이는 1 ~ 32 글자입니다.', 'name')
export const NAME_DUPE = new FormError('NAME_DUPE', '이미 등록되어 있는 이름입니다.', 'name')

export const HOME_EMPTY = new FormError('HOME_EMPTY', '개인 주소를 입력해 주십시오.', 'home')
export const HOME_RANGE = new FormError('HOME_RANGE', '개인 주소 길이는 1 ~ 32 글자입니다.', 'home')
export const HOME_DUPE = new FormError('HOME_DUPE', '이미 등록되어 있는 개인 주소입니다.', 'home')

export const EMAIL_EMPTY = new FormError('EMAIL_EMPTY', '이메일 주소를 입력해 주십시오.', 'email')
export const EMAIL_RANGE = new FormError('EMAIL_RANGE', '이메일 주소 길이는 8 ~ 64 글자입니다.', 'email')
export const EMAIL_PATTERN = new FormError('EMAIL_PATTERN', '이메일 형식이 잘못되었습니다.', 'email')
export const EMAIL_DUPE = new FormError('EMAIL_DUPE', '이미 등록되어 있는 이메일입니다.', 'email')

export const PASSWORD_EMPTY = new FormError('PASSWORD_EMPTY', '비밀번호를 입력해 주십시오.', 'password')
export const PASSWORD_RANGE = new FormError('PASSWORD_RANGE', '비밀번호 길이는 4 ~ 32 글자입니다.', 'password')

export const EMAIL_NOT_EXIST = new FormError('EMAIL_NOT_EXIST', '등록되지 않은 이메일입니다.', 'email')
export const RESET_TIMEOUT = new FormError('RESET_TIMEOUT', '비밀번호 초기화 토큰 유효시간이 지났습니다.')

export interface User {
  id: number
  name: string
  home: string
  email: string
  hash: string
  status: 'v' | 'd'
  admin: boolean
  profile: string
  cdate: Date
  adate: Date
  pdate: Date
}

export function newUser(): User {
  const now = new Date()
  return {
    id: 0,
    name: '',
    home: '',
    email: '',
    hash: '',
    status: 'v',
    admin: false,
    profile: '',
    cdate: now,
    adate: now,
    pdate: new Date(2000, 0, 1),
  }
}

// bcrypt hash

export function makePasswordHash(pw: string, cb?: ((err: Error, hash: string) => void) | undefined) {
  bcryptjs.hash(pw, 10, cb)
}

export function checkPassword(pw: string, hash: string, cb?: (err: Error, success: boolean) => void) {
  return bcryptjs.compare(pw, hash, cb)
}

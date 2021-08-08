import { Request } from 'express'
import { Done, waterfall } from '../../lib/base/async2.js'
import { FormError } from '../../lib/base/error2.js'
import { UserDB } from './db/user-db.js'
import { User } from './domain/user-domain.js'

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

export function checkEmailFormat(email: string, errors: FormError[]) {
  if (email.length === 0) {
    errors.push(EMAIL_EMPTY)
  } else if (email.length > 64 || email.length < 8) {
    errors.push(EMAIL_RANGE)
  } else if (!emailPattern.test(email)) {
    errors.push(EMAIL_PATTERN)
  }
}

export function checkUserForm(form: UserForm, errors: FormError[]) {
  if (form.name.length === 0) {
    errors.push(NAME_EMPTY)
  } else if (form.name.length > 32) {
    errors.push(NAME_RANGE)
  }

  if (form.home.length === 0) {
    errors.push(HOME_EMPTY)
  } else if (form.home.length > 32) {
    errors.push(HOME_RANGE)
  }

  checkEmailFormat(form.email, errors)

  if (form.id === 0 || form.password.length > 0) {
    if (form.password.length === 0) {
      errors.push(PASSWORD_EMPTY)
    } else if (form.password.length > 32 || form.password.length < 4) {
      errors.push(PASSWORD_RANGE)
    }
  }
}

export function checkUserFormDB(userdb: UserDB, form: UserForm, errors: FormError[], done: Done) {
  waterfall(
    (done) => {
      userdb.checkNameUsable(form.id, form.name, (err, usable) => {
        if (err) return done(err)
        if (!usable) {
          errors.push(NAME_DUPE)
        }
        done()
      })
    },
    (done) => {
      userdb.checkNameUsable(form.id, form.home, (err, usable) => {
        if (err) return done(err)
        if (!usable) {
          errors.push(HOME_DUPE)
        }
        done()
      })
    },
    (done) => {
      userdb.checkEmailUsable(form.id, form.email, function (err, usable) {
        if (err) return done(err)
        if (!usable) {
          errors.push(EMAIL_DUPE)
        }
        done()
      })
    }
  ).run(done)
}

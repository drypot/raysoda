import {
  EMAIL_EMPTY,
  EMAIL_PATTERN,
  EMAIL_RANGE,
  HOME_EMPTY,
  HOME_RANGE,
  NAME_EMPTY,
  NAME_RANGE,
  PASSWORD_EMPTY,
  PASSWORD_RANGE
} from '../../../common/type/error-const.js'
import { ErrorConst } from '../../../common/type/error.js'
import { emailPatternIsOk } from '../../../common/util/email.js'

export function checkUserName(name: string, err: ErrorConst[]) {
  if (name.length === 0) {
    err.push(NAME_EMPTY)
  } else if (name.length > 32) {
    err.push(NAME_RANGE)
  }
}

export function checkUserHome(home: string, err: ErrorConst[]) {
  if (home.length === 0) {
    err.push(HOME_EMPTY)
  } else if (home.length > 32) {
    err.push(HOME_RANGE)
  }
}

export function checkUserEmail(email: string, err: ErrorConst[]) {
  if (email.length === 0) {
    err.push(EMAIL_EMPTY)
  } else if (email.length > 64 || email.length < 8) {
    err.push(EMAIL_RANGE)
  } else if (!emailPatternIsOk(email)) {
    err.push(EMAIL_PATTERN)
  }
}

export function checkUserPassword(password: string, err: ErrorConst[]) {
  if (password.length === 0) {
    err.push(PASSWORD_EMPTY)
  } else if (password.length > 32 || password.length < 4) {
    err.push(PASSWORD_RANGE)
  }
}

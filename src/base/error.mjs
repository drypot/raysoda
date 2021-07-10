export class FormError {
  constructor(code, message, field) {
    this.code = code
    this.message = message
    this.field = field
  }

  spawn() {
    return new FormError(this.code, this.message, this.field)
  }
}

export const UNKNOWN_ERROR = new FormError('UNKNOWN', 'Unknown error')
export const INVALID_DATA = new FormError('INVALID_DATA', '비정상적인 값이 입력되었습니다.')

export function errorExists(errs, err) {
  if (errs instanceof Array) {
    for (const e of errs) {
      if (e.code === err.code) {
        return true
      }
    }
  } else {
    if (errs.code === err.code) {
      return true
    }
  }
  return false
}

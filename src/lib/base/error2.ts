export interface FormError {
  name: string
  message: string
  field: string
}

export function formErrorOf(name: string, message: string = '', field: string = ''): FormError {
  return {
    name,
    message,
    field
  }
}

export const UNKNOWN_ERROR = formErrorOf('UNKNOWN', 'Unknown error')
export const INVALID_DATA = formErrorOf('INVALID_DATA', '비정상적인 값이 입력되었습니다.')

export function errorExists(err: FormError, errs: FormError | FormError[]) {
  // res.body.err 를 통해 들어온 err 는 FormError 타입이 아니라 일반 Object 이다.
  // 해서 errs instanceof FormError 조건은 오류를 일으킨다.
  if (errs instanceof Array) {
    for (const e of errs) {
      if (e.name === err.name) {
        return true
      }
    }
    return false
  }
  return errs.name === err.name
}

export function logError(errs: any, logger = console.log) {
  if (errs instanceof Array) {
    for (const err of errs as FormError[]) {
      logger(err.message)
    }
    return
  }
  logger(errs)
}

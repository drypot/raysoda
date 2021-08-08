export class FormError {
  constructor(
    public name: string,
    public message: string = '',
    public field?: string
  ) {
  }

  spawn() {
    return new FormError(this.name, this.message, this.field)
  }
}

export const UNKNOWN_ERROR = new FormError('UNKNOWN', 'Unknown error')
export const INVALID_DATA = new FormError('INVALID_DATA', '비정상적인 값이 입력되었습니다.')

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

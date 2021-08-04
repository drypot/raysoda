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

export function lookupErrors(errs: FormError | FormError[], err: FormError) {
  if (errs instanceof FormError) {
    return errs.name === err.name
  }
  for (const e of errs) {
    if (e.name === err.name) {
      return true
    }
  }
  return false
}

// Error2 를 시리얼라이즈하면 class 정보가 사라진다.
// 해서 class 대신 plain object 로 만들기로 한다.

export interface Error2 {
  name: string
  message: string
  field: string
}

export function errorOf(name: string, message: string = '', field: string = '') {
  return {
    name,
    message,
    field
  } as Error2
}

export const UNKNOWN_ERROR = errorOf('UNKNOWN', 'Unknown error')
export const INVALID_DATA = errorOf('INVALID_DATA', '비정상적인 값이 입력되었습니다.')

export function findError(list: Error2[], target: Error2) {
  for (const e of list) {
    if (e.name === target.name) {
      return e
    }
  }
}

export function logError(list: any, logger = console.log) {
  if (list instanceof Array) {
    for (const e of list) {
      logger(e.message)
    }
    return
  }
  logger(list)
}

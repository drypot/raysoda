import { errorOf } from './error2.js'

export const UNKNOWN_ERROR = errorOf('UNKNOWN', 'Unknown error')
export const INVALID_DATA = errorOf('INVALID_DATA', '비정상적인 값이 입력되었습니다.')

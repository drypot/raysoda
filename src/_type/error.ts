import { newErrorConst } from '../_util/error2.js'

export type ErrorConst = {
  name: string
  message: string
  field: string
}

export const INVALID_DATA = newErrorConst('INVALID_DATA', '비정상적인 값이 입력되었습니다.')
export const INVALID_PAGE = newErrorConst('INVALID_PAGE', '요청하신 페이지가 없습니다.')

import { newErrorConst } from '../_util/error2'

export const IMAGE_NOT_EXIST = newErrorConst('IMAGE_NOT_EXIST', '파일이 없습니다.')
export const IMAGE_NO_FILE = newErrorConst('IMAGE_NO_FILE', '아미지 파일이 첨부되지 않았습니다.', 'files')
export const IMAGE_SIZE = newErrorConst('IMAGE_SIZE', '이미지의 가로, 세로 크기가 너무 작습니다.', 'files')
export const IMAGE_TYPE = newErrorConst('IMAGE_TYPE', '인식할 수 없는 파일입니다.', 'files')

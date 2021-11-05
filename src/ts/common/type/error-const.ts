import { newErrorConst } from '@common/util/error2'

// Base
export const INVALID_DATA = newErrorConst('INVALID_DATA', '비정상적인 값이 입력되었습니다.')

// User

export const NOT_AUTHENTICATED = newErrorConst('NOT_AUTHENTICATED', '먼저 로그인해 주십시오.')
export const NOT_AUTHORIZED = newErrorConst('NOT_AUTHORIZED', '사용 권한이 없습니다.')
export const USER_NOT_FOUND = newErrorConst('USER_NOT_FOUND', '사용자를 찾을 수 없습니다.')
export const EMAIL_NOT_FOUND = newErrorConst('EMAIL_NOT_FOUND', '등록되지 않은 이메일입니다.', 'email')
export const ACCOUNT_DEACTIVATED = newErrorConst('ACCOUNT_DEACTIVATED', '사용 중지된 계정입니다.', 'email')
export const PASSWORD_WRONG = newErrorConst('PASSWORD_WRONG', '비밀번호가 틀렸습니다.', 'password')

export const NAME_EMPTY = newErrorConst('NAME_EMPTY', '이름을 입력해 주십시오.', 'name')
export const NAME_RANGE = newErrorConst('NAME_RANGE', '이름 길이는 1 ~ 32 글자입니다.', 'name')
export const NAME_DUPE = newErrorConst('NAME_DUPE', '이미 등록되어 있는 이름입니다.', 'name')

export const HOME_EMPTY = newErrorConst('HOME_EMPTY', '개인 주소를 입력해 주십시오.', 'home')
export const HOME_RANGE = newErrorConst('HOME_RANGE', '개인 주소 길이는 1 ~ 32 글자입니다.', 'home')
export const HOME_DUPE = newErrorConst('HOME_DUPE', '이미 등록되어 있는 개인 주소입니다.', 'home')

export const EMAIL_EMPTY = newErrorConst('EMAIL_EMPTY', '이메일 주소를 입력해 주십시오.', 'email')
export const EMAIL_RANGE = newErrorConst('EMAIL_RANGE', '이메일 주소 길이는 8 ~ 64 글자입니다.', 'email')
export const EMAIL_PATTERN = newErrorConst('EMAIL_PATTERN', '이메일 형식이 잘못되었습니다.', 'email')
export const EMAIL_DUPE = newErrorConst('EMAIL_DUPE', '이미 등록되어 있는 이메일입니다.', 'email')

export const PASSWORD_EMPTY = newErrorConst('PASSWORD_EMPTY', '비밀번호를 입력해 주십시오.', 'password')
export const PASSWORD_RANGE = newErrorConst('PASSWORD_RANGE', '비밀번호 길이는 4 ~ 32 글자입니다.', 'password')

export const PASSWORD_RESET_TIMEOUT = newErrorConst('PASSWORD_RESET_TIMEOUT', '비밀번호 초기화 유효시간이 지났습니다.')

// Image

export const IMAGE_NOT_EXIST = newErrorConst('IMAGE_NOT_EXIST', '파일이 없습니다.')
export const IMAGE_NO_FILE = newErrorConst('IMAGE_NO_FILE', '아미지 파일이 첨부되지 않았습니다.', 'file')
export const IMAGE_SIZE = newErrorConst('IMAGE_SIZE', '이미지의 가로, 세로 크기가 너무 작습니다.', 'file')
export const IMAGE_TYPE = newErrorConst('IMAGE_TYPE', '인식할 수 없는 파일입니다.', 'file')


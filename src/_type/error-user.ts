import { getErrorConst } from '../_util/error2.js'

export const NOT_AUTHENTICATED = getErrorConst('NOT_AUTHENTICATED', '먼저 로그인해 주십시오.')
export const NOT_AUTHORIZED = getErrorConst('NOT_AUTHORIZED', '사용 권한이 없습니다.')
export const USER_NOT_FOUND = getErrorConst('USER_NOT_FOUND', '사용자를 찾을 수 없습니다.')
export const EMAIL_NOT_FOUND = getErrorConst('EMAIL_NOT_FOUND', '등록되지 않은 이메일입니다.', 'email')
export const ACCOUNT_DEACTIVATED = getErrorConst('ACCOUNT_DEACTIVATED', '사용중지된 계정입니다.', 'email')
export const PASSWORD_WRONG = getErrorConst('PASSWORD_WRONG', '비밀번호가 틀렸습니다.', 'password')

export const NAME_EMPTY = getErrorConst('NAME_EMPTY', '이름을 입력해 주십시오.', 'name')
export const NAME_RANGE = getErrorConst('NAME_RANGE', '이름 길이는 1 ~ 32 글자입니다.', 'name')
export const NAME_DUPE = getErrorConst('NAME_DUPE', '이미 등록되어 있는 이름입니다.', 'name')

export const HOME_EMPTY = getErrorConst('HOME_EMPTY', '개인 주소를 입력해 주십시오.', 'home')
export const HOME_RANGE = getErrorConst('HOME_RANGE', '개인 주소 길이는 1 ~ 32 글자입니다.', 'home')
export const HOME_DUPE = getErrorConst('HOME_DUPE', '이미 등록되어 있는 개인 주소입니다.', 'home')

export const EMAIL_EMPTY = getErrorConst('EMAIL_EMPTY', '이메일 주소를 입력해 주십시오.', 'email')
export const EMAIL_RANGE = getErrorConst('EMAIL_RANGE', '이메일 주소 길이는 8 ~ 64 글자입니다.', 'email')
export const EMAIL_PATTERN = getErrorConst('EMAIL_PATTERN', '이메일 형식이 잘못되었습니다.', 'email')
export const EMAIL_DUPE = getErrorConst('EMAIL_DUPE', '이미 등록되어 있는 이메일입니다.', 'email')

export const PASSWORD_EMPTY = getErrorConst('PASSWORD_EMPTY', '비밀번호를 입력해 주십시오.', 'password')
export const PASSWORD_RANGE = getErrorConst('PASSWORD_RANGE', '비밀번호 길이는 4 ~ 32 글자입니다.', 'password')

export const RESET_TIMEOUT = getErrorConst('RESET_TIMEOUT', '비밀번호 초기화 토큰 유효시간이 지났습니다.')

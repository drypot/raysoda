import { Error2 } from '../../_error/error2.js'
import { checkEmailFormat, checkHomeFormat, checkNameFormat, checkPasswordFormat } from './_user-service.js'
import {
  EMAIL_EMPTY,
  EMAIL_RANGE,
  HOME_EMPTY,
  HOME_RANGE,
  NAME_EMPTY,
  NAME_RANGE,
  PASSWORD_EMPTY,
  PASSWORD_RANGE
} from '../../_error/error-user.js'

describe('User Form', () => {

  describe('check name format', () => {
    it('err if name empty', () => {
      const err: Error2[] = []
      checkNameFormat('', err)
      expect(err).toContain(NAME_EMPTY)
    })
    it('ok if name length 32', () => {
      const err: Error2[] = []
      const name = 'c'.repeat(32)
      checkNameFormat(name, err)
      expect(err.length).toBe(0)
    })
    it('err if name length 33', () => {
      const err: Error2[] = []
      const name = 'c'.repeat(33)
      checkNameFormat(name, err)
      expect(err).toContain(NAME_RANGE)
    })
    it('ok if name valid', () => {
      const err: Error2[] = []
      checkNameFormat('User 1', err)
      expect(err.length).toBe(0)
    })
  })

  describe('check home format', () => {
    it('err if empty', () => {
      const err: Error2[] = []
      checkHomeFormat('', err)
      expect(err).toContain(HOME_EMPTY)
    })
    it('ok if length 32', () => {
      const err: Error2[] = []
      const home = 'c'.repeat(32)
      checkHomeFormat(home, err)
      expect(err.length).toBe(0)
    })
    it('err if length 33', () => {
      const err: Error2[] = []
      const home = 'c'.repeat(33)
      checkHomeFormat(home, err)
      expect(err).toContain(HOME_RANGE)
    })
    it('ok if valid', () => {
      const err: Error2[] = []
      checkHomeFormat('user1', err)
      expect(err.length).toBe(0)
    })
  })

  describe('check email format', () => {
    it('err if empty', () => {
      const err: Error2[] = []
      checkEmailFormat('', err)
      expect(err).toContain(EMAIL_EMPTY)
    })
    it('err if length 7', () => {
      const err: Error2[] = []
      checkEmailFormat('12@45.7', err)
      expect(err.length).toBe(1)
      expect(err).toContain(EMAIL_RANGE)
    })
    it('ok if length 8', () => {
      const err: Error2[] = []
      checkEmailFormat('12@45.78', err)
      expect(err.length).toBe(0)
    })
    it('ok if length 64', () => {
      const err: Error2[] = []
      const email = '123@567.90' + 'c'.repeat(54)
      checkEmailFormat(email, err)
      expect(err.length).toBe(0)
    })
    it('err if length 65', () => {
      const err: Error2[] = []
      const email = '123@567.90' + 'c'.repeat(55)
      checkEmailFormat(email, err)
      expect(err).toContain(EMAIL_RANGE)
    })
    it('ok if valid', () => {
      const err: Error2[] = []
      checkEmailFormat('user1@mail.test', err)
      expect(err.length).toBe(0)
    })
  })

  describe('password format', () => {
    it('ok if password valid', () => {
      const err: Error2[] = []
      checkPasswordFormat('abcd1234', err)
      expect(err.length).toBe(0)
    })
    it('err if password empty', () => {
      const err: Error2[] = []
      checkPasswordFormat('', err)
      expect(err).toContain(PASSWORD_EMPTY)
    })
    it('err if password length 3', () => {
      const err: Error2[] = []
      const password = 'c'.repeat(3)
      checkPasswordFormat(password, err)
      expect(err).toContain(PASSWORD_RANGE)
    })
    it('ok if password length 4', () => {
      const err: Error2[] = []
      const password = 'c'.repeat(4)
      checkPasswordFormat(password, err)
      expect(err.length).toBe(0)
    })
    it('ok if password length 32', () => {
      const err: Error2[] = []
      const password = 'c'.repeat(32)
      checkPasswordFormat(password, err)
      expect(err.length).toBe(0)
    })
    it('err if password length 33', () => {
      const err: Error2[] = []
      const password = 'c'.repeat(33)
      checkPasswordFormat(password, err)
      expect(err).toContain(PASSWORD_RANGE)
    })
  })

})
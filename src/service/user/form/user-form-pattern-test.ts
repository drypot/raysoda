import { FormError } from '../../../lib/base/error2.js'
import {
  checkEmailFormat,
  checkHomeFormat,
  checkNameFormat,
  checkPasswordFormat,
  EMAIL_EMPTY,
  EMAIL_RANGE,
  HOME_EMPTY,
  HOME_RANGE,
  NAME_EMPTY,
  NAME_RANGE,
  PASSWORD_EMPTY,
  PASSWORD_RANGE
} from './user-form.js'

describe('User Form', () => {

  describe('check name format', () => {
    it('err if name empty', () => {
      const errs: FormError[] = []
      checkNameFormat('', errs)
      expect(errs).toContain(NAME_EMPTY)
    })
    it('ok if name length 32', () => {
      const errs: FormError[] = []
      const name = 'c'.repeat(32)
      checkNameFormat(name, errs)
      expect(errs.length).toBe(0)
    })
    it('err if name length 33', () => {
      const errs: FormError[] = []
      const name = 'c'.repeat(33)
      checkNameFormat(name, errs)
      expect(errs).toContain(NAME_RANGE)
    })
    it('ok if name valid', () => {
      const errs: FormError[] = []
      checkNameFormat('User 1', errs)
      expect(errs.length).toBe(0)
    })
  })

  describe('check home format', () => {
    it('err if empty', () => {
      const errs: FormError[] = []
      checkHomeFormat('', errs)
      expect(errs).toContain(HOME_EMPTY)
    })
    it('ok if length 32', () => {
      const errs: FormError[] = []
      const home = 'c'.repeat(32)
      checkHomeFormat(home, errs)
      expect(errs.length).toBe(0)
    })
    it('err if length 33', () => {
      const errs: FormError[] = []
      const home = 'c'.repeat(33)
      checkHomeFormat(home, errs)
      expect(errs).toContain(HOME_RANGE)
    })
    it('ok if valid', () => {
      const errs: FormError[] = []
      checkHomeFormat('user1', errs)
      expect(errs.length).toBe(0)
    })
  })

  describe('check email format', () => {
    it('err if empty', () => {
      const errs: FormError[] = []
      checkEmailFormat('', errs)
      expect(errs).toContain(EMAIL_EMPTY)
    })
    it('err if length 7', () => {
      const errs: FormError[] = []
      checkEmailFormat('12@45.7', errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(EMAIL_RANGE)
    })
    it('ok if length 8', () => {
      const errs: FormError[] = []
      checkEmailFormat('12@45.78', errs)
      expect(errs.length).toBe(0)
    })
    it('ok if length 64', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(54)
      checkEmailFormat(email, errs)
      expect(errs.length).toBe(0)
    })
    it('err if length 65', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(55)
      checkEmailFormat(email, errs)
      expect(errs).toContain(EMAIL_RANGE)
    })
    it('ok if valid', () => {
      const errs: FormError[] = []
      checkEmailFormat('user1@mail.test', errs)
      expect(errs.length).toBe(0)
    })
  })

  describe('password format', () => {
    it('ok if password valid', () => {
      const errs: FormError[] = []
      checkPasswordFormat('abcd1234', errs)
      expect(errs.length).toBe(0)
    })
    it('err if password empty', () => {
      const errs: FormError[] = []
      checkPasswordFormat('', errs)
      expect(errs).toContain(PASSWORD_EMPTY)
    })
    it('err if password length 3', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(3)
      checkPasswordFormat(password, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
    it('ok if password length 4', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(4)
      checkPasswordFormat(password, errs)
      expect(errs.length).toBe(0)
    })
    it('ok if password length 32', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(32)
      checkPasswordFormat(password, errs)
      expect(errs.length).toBe(0)
    })
    it('err if password length 33', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(33)
      checkPasswordFormat(password, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
  })

})

import { checkEmailFormat, EMAIL_EMPTY, EMAIL_PATTERN, EMAIL_RANGE } from './user-form.js'
import { errorExists, FormError } from '../../lib/base/error2.js'

describe('checkEmailFormat', () => {

  it('should work with valid email', () => {
    const errs: FormError[] = []
    checkEmailFormat('alice@mail.com', errs)
    expect(errs.length).toBe(0)
  })

  describe('empty check', () => {
    it('should work', () => {
      const errs: FormError[] = []
      checkEmailFormat('', errs)
      expect(errorExists(EMAIL_EMPTY, errs)).toBe(true)
    })
  })

  describe('range check', () => {
    it('should fail when length 7', () => {
      const errs: FormError[] = []
      checkEmailFormat('12@45.7', errs)
      expect(errs.length).toBe(1)
      expect(errorExists(EMAIL_RANGE, errs)).toBe(true)
    })
    it('should pass when length 8', () => {
      const errs: FormError[] = []
      checkEmailFormat('12@45.78', errs)
      expect(errorExists(EMAIL_RANGE, errs)).toBe(false)
    })
    it('should pass when length 64', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(54)
      checkEmailFormat(email, errs)
      expect(errorExists(EMAIL_RANGE, errs)).toBe(false)
    })
    it('should fail when length 65', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(55)
      checkEmailFormat(email, errs)
      expect(errorExists(EMAIL_RANGE, errs)).toBe(true)
    })
  })

  describe('pattern check', () => {
    it('should work with no @', () => {
      const errs: FormError[] = []
      checkEmailFormat('abc.mail.com', errs)
      expect(errorExists(EMAIL_PATTERN, errs)).toBe(true)
    })
    it('should work with *', () => {
      const errs: FormError[] = []
      checkEmailFormat('abc*xyz@mail.com', errs)
      expect(errorExists(EMAIL_PATTERN, errs)).toBe(true)
    })
    it('should work with -', () => {
      const errs: FormError[] = []
      checkEmailFormat('-a-b-c_d-e-f@mail.com', errs)
      expect(errorExists(EMAIL_PATTERN, errs)).toBe(false)
    })
    it('should work with .', () => {
      const errs: FormError[] = []
      checkEmailFormat('develop.bj@mail.com', errs)
      expect(errorExists(EMAIL_PATTERN, errs)).toBe(false)
    })
  })

})

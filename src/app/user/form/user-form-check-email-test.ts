import { checkUserFormEmail, EMAIL_EMPTY, EMAIL_PATTERN, EMAIL_RANGE } from './user-form.js'
import { FormError } from '../../../lib/base/error2.js'

describe('UserForm', () => {

  describe('checkUserFormEmail', () => {

    it('should pass when valid', () => {
      const errs: FormError[] = []
      checkUserFormEmail('alice@mail.com', errs)
      expect(errs.length).toBe(0)
    })

    it('should fail when empty', () => {
      const errs: FormError[] = []
      checkUserFormEmail('', errs)
      expect(errs).toContain(EMAIL_EMPTY)
    })

    it('should fail when length 7', () => {
      const errs: FormError[] = []
      checkUserFormEmail('12@45.7', errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(EMAIL_RANGE)
    })
    it('should pass when length 8', () => {
      const errs: FormError[] = []
      checkUserFormEmail('12@45.78', errs)
      expect(errs.length).toBe(0)
    })
    it('should pass when length 64', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(54)
      checkUserFormEmail(email, errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when length 65', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(55)
      checkUserFormEmail(email, errs)
      expect(errs).toContain(EMAIL_RANGE)
    })

    it('should fail with no @', () => {
      const errs: FormError[] = []
      checkUserFormEmail('abc.mail.com', errs)
      expect(errs).toContain(EMAIL_PATTERN)
    })
    it('should fail with *', () => {
      const errs: FormError[] = []
      checkUserFormEmail('abc*xyz@mail.com', errs)
      expect(errs).toContain(EMAIL_PATTERN)
    })
    it('should pass with -', () => {
      const errs: FormError[] = []
      checkUserFormEmail('-a-b-c_d-e-f@mail.com', errs)
      expect(errs.length).toBe(0)
    })
    it('should pass with .', () => {
      const errs: FormError[] = []
      checkUserFormEmail('develop.bj@mail.com', errs)
      expect(errs.length).toBe(0)
    })

  })

})

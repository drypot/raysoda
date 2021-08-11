import { checkUserEmail, EMAIL_EMPTY, EMAIL_PATTERN, EMAIL_RANGE } from './user-form.js'
import { FormError } from '../../../lib/base/error2.js'

describe('UserForm', () => {

  describe('checkUserFormEmail', () => {

    it('should pass when valid', () => {
      const errs: FormError[] = []
      checkUserEmail('alice@mail.test', errs)
      expect(errs.length).toBe(0)
    })

    it('should fail when empty', () => {
      const errs: FormError[] = []
      checkUserEmail('', errs)
      expect(errs).toContain(EMAIL_EMPTY)
    })

    it('should fail when length 7', () => {
      const errs: FormError[] = []
      checkUserEmail('12@45.7', errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(EMAIL_RANGE)
    })
    it('should pass when length 8', () => {
      const errs: FormError[] = []
      checkUserEmail('12@45.78', errs)
      expect(errs.length).toBe(0)
    })
    it('should pass when length 64', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(54)
      checkUserEmail(email, errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when length 65', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(55)
      checkUserEmail(email, errs)
      expect(errs).toContain(EMAIL_RANGE)
    })

    it('should fail with no @', () => {
      const errs: FormError[] = []
      checkUserEmail('abc.mail.test', errs)
      expect(errs).toContain(EMAIL_PATTERN)
    })
    it('should fail with *', () => {
      const errs: FormError[] = []
      checkUserEmail('abc*xyz@mail.test', errs)
      expect(errs).toContain(EMAIL_PATTERN)
    })
    it('should pass with -', () => {
      const errs: FormError[] = []
      checkUserEmail('-a-b-c_d-e-f@mail.test', errs)
      expect(errs.length).toBe(0)
    })
    it('should pass with .', () => {
      const errs: FormError[] = []
      checkUserEmail('develop.bj@mail.test', errs)
      expect(errs.length).toBe(0)
    })

  })

})

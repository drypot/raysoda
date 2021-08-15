import { checkEmailFormat, EMAIL_EMPTY, EMAIL_PATTERN, EMAIL_RANGE } from './user-form.js'
import { FormError } from '../../../lib/base/error2.js'

describe('UserForm', () => {

  describe('checkEmailFormat', () => {

    it('should ok when valid', () => {
      const errs: FormError[] = []
      checkEmailFormat('user1@mail.test', errs)
      expect(errs.length).toBe(0)
    })

    it('should fail when empty', () => {
      const errs: FormError[] = []
      checkEmailFormat('', errs)
      expect(errs).toContain(EMAIL_EMPTY)
    })

    it('should fail when length 7', () => {
      const errs: FormError[] = []
      checkEmailFormat('12@45.7', errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(EMAIL_RANGE)
    })
    it('should ok when length 8', () => {
      const errs: FormError[] = []
      checkEmailFormat('12@45.78', errs)
      expect(errs.length).toBe(0)
    })
    it('should ok when length 64', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(54)
      checkEmailFormat(email, errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when length 65', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(55)
      checkEmailFormat(email, errs)
      expect(errs).toContain(EMAIL_RANGE)
    })

    it('should fail with no @', () => {
      const errs: FormError[] = []
      checkEmailFormat('abc.mail.test', errs)
      expect(errs).toContain(EMAIL_PATTERN)
    })
    it('should fail with *', () => {
      const errs: FormError[] = []
      checkEmailFormat('abc*xyz@mail.test', errs)
      expect(errs).toContain(EMAIL_PATTERN)
    })
    it('should ok with -', () => {
      const errs: FormError[] = []
      checkEmailFormat('-a-b-c_d-e-f@mail.test', errs)
      expect(errs.length).toBe(0)
    })
    it('should ok with .', () => {
      const errs: FormError[] = []
      checkEmailFormat('develop.bj@mail.test', errs)
      expect(errs.length).toBe(0)
    })

  })

})

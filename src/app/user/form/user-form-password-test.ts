import { FormError } from '../../../lib/base/error2.js'
import { checkPasswordFormat, PASSWORD_EMPTY, PASSWORD_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkPasswordFormat', () => {
    it('should ok when valid', () => {
      const errs: FormError[] = []
      checkPasswordFormat('abcd1234', errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when empty', () => {
      const errs: FormError[] = []
      checkPasswordFormat('', errs)
      expect(errs).toContain(PASSWORD_EMPTY)
    })
    it('should fail when length 3', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(3)
      checkPasswordFormat(password, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
    it('should ok when length 4', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(4)
      checkPasswordFormat(password, errs)
      expect(errs.length).toBe(0)
    })
    it('should ok when length 32', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(32)
      checkPasswordFormat(password, errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when length 33', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(33)
      checkPasswordFormat(password, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
  })

})

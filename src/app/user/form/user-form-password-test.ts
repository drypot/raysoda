import { FormError } from '../../../lib/base/error2.js'
import { checkUserPassword, PASSWORD_EMPTY, PASSWORD_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkUserFormPassword', () => {
    it('should ok when valid', () => {
      const errs: FormError[] = []
      checkUserPassword('abcd1234', errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when empty', () => {
      const errs: FormError[] = []
      checkUserPassword('', errs)
      expect(errs).toContain(PASSWORD_EMPTY)
    })
    it('should fail when length 3', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(3)
      checkUserPassword(password, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
    it('should ok when length 4', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(4)
      checkUserPassword(password, errs)
      expect(errs.length).toBe(0)
    })
    it('should ok when length 32', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(32)
      checkUserPassword(password, errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when length 33', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(33)
      checkUserPassword(password, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
  })

})

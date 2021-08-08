import { FormError } from '../../../lib/base/error2.js'
import { checkUserFormPassword, PASSWORD_EMPTY, PASSWORD_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkUserFormPassword', () => {

    it('should pass when valid', () => {
      const errs: FormError[] = []
      checkUserFormPassword('abcd1234', errs)
      expect(errs.length).toBe(0)
    })

    it('should fail when empty', () => {
      const errs: FormError[] = []
      checkUserFormPassword('', errs)
      expect(errs).toContain(PASSWORD_EMPTY)
    })

    it('should fail when length 3', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(3)
      checkUserFormPassword(password, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
    it('should pass when length 4', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(4)
      checkUserFormPassword(password, errs)
      expect(errs.length).toBe(0)
    })
    it('should pass when length 32', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(32)
      checkUserFormPassword(password, errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when length 33', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(33)
      checkUserFormPassword(password, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })

  })

})

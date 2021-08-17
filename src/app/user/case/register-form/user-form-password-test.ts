import { FormError } from '../../../../lib/base/error2.js'
import { checkPasswordFormat, PASSWORD_EMPTY, PASSWORD_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkPasswordFormat', () => {
    it('ok if valid', () => {
      const errs: FormError[] = []
      checkPasswordFormat('abcd1234', errs)
      expect(errs.length).toBe(0)
    })
    it('fail if empty', () => {
      const errs: FormError[] = []
      checkPasswordFormat('', errs)
      expect(errs).toContain(PASSWORD_EMPTY)
    })
    it('fail if length 3', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(3)
      checkPasswordFormat(password, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
    it('ok if length 4', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(4)
      checkPasswordFormat(password, errs)
      expect(errs.length).toBe(0)
    })
    it('ok if length 32', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(32)
      checkPasswordFormat(password, errs)
      expect(errs.length).toBe(0)
    })
    it('fail if length 33', () => {
      const errs: FormError[] = []
      const password = 'c'.repeat(33)
      checkPasswordFormat(password, errs)
      expect(errs).toContain(PASSWORD_RANGE)
    })
  })

})

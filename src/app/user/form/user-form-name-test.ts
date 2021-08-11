import { FormError } from '../../../lib/base/error2.js'
import { checkUserName, NAME_EMPTY, NAME_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkUserFormName', () => {

    it('should pass when valid', () => {
      const errs: FormError[] = []
      checkUserName('alice', errs)
      expect(errs.length).toBe(0)
    })

    it('should fail when empty', () => {
      const errs: FormError[] = []
      checkUserName('', errs)
      expect(errs).toContain(NAME_EMPTY)
    })

    it('should pass when length 32', () => {
      const errs: FormError[] = []
      const name = 'c'.repeat(32)
      checkUserName(name, errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when length 33', () => {
      const errs: FormError[] = []
      const name = 'c'.repeat(33)
      checkUserName(name, errs)
      expect(errs).toContain(NAME_RANGE)
    })

  })

})

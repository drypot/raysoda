import { FormError } from '../../../lib/base/error2.js'
import { checkUserFormName, NAME_EMPTY, NAME_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkUserFormName', () => {

    it('should pass when valid', () => {
      const errs: FormError[] = []
      checkUserFormName('alice', errs)
      expect(errs.length).toBe(0)
    })

    it('should fail when empty', () => {
      const errs: FormError[] = []
      checkUserFormName('', errs)
      expect(errs).toContain(NAME_EMPTY)
    })

    it('should pass when length 32', () => {
      const errs: FormError[] = []
      const name = 'c'.repeat(32)
      checkUserFormName(name, errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when length 33', () => {
      const errs: FormError[] = []
      const name = 'c'.repeat(33)
      checkUserFormName(name, errs)
      expect(errs).toContain(NAME_RANGE)
    })

  })

})

import { FormError } from '../../../lib/base/error2.js'
import { checkNameFormat, NAME_EMPTY, NAME_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkNameFormat', () => {

    it('should ok when valid', () => {
      const errs: FormError[] = []
      checkNameFormat('user1', errs)
      expect(errs.length).toBe(0)
    })

    it('should fail when empty', () => {
      const errs: FormError[] = []
      checkNameFormat('', errs)
      expect(errs).toContain(NAME_EMPTY)
    })

    it('should ok when length 32', () => {
      const errs: FormError[] = []
      const name = 'c'.repeat(32)
      checkNameFormat(name, errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when length 33', () => {
      const errs: FormError[] = []
      const name = 'c'.repeat(33)
      checkNameFormat(name, errs)
      expect(errs).toContain(NAME_RANGE)
    })

  })

})

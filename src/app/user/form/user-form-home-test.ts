import { FormError } from '../../../lib/base/error2.js'
import { checkUserFormHome, HOME_EMPTY, HOME_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkUserFormHome', () => {

    it('should pass when valid', () => {
      const errs: FormError[] = []
      checkUserFormHome('alice', errs)
      expect(errs.length).toBe(0)
    })

    it('should fail when empty', () => {
      const errs: FormError[] = []
      checkUserFormHome('', errs)
      expect(errs).toContain(HOME_EMPTY)
    })

    it('should pass when length 32', () => {
      const errs: FormError[] = []
      const home = 'c'.repeat(32)
      checkUserFormHome(home, errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when length 33', () => {
      const errs: FormError[] = []
      const home = 'c'.repeat(33)
      checkUserFormHome(home, errs)
      expect(errs).toContain(HOME_RANGE)
    })

  })

})


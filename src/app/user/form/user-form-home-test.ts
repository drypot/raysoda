import { FormError } from '../../../lib/base/error2.js'
import { checkUserHome, HOME_EMPTY, HOME_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkUserFormHome', () => {

    it('should ok when valid', () => {
      const errs: FormError[] = []
      checkUserHome('user1', errs)
      expect(errs.length).toBe(0)
    })

    it('should fail when empty', () => {
      const errs: FormError[] = []
      checkUserHome('', errs)
      expect(errs).toContain(HOME_EMPTY)
    })

    it('should ok when length 32', () => {
      const errs: FormError[] = []
      const home = 'c'.repeat(32)
      checkUserHome(home, errs)
      expect(errs.length).toBe(0)
    })
    it('should fail when length 33', () => {
      const errs: FormError[] = []
      const home = 'c'.repeat(33)
      checkUserHome(home, errs)
      expect(errs).toContain(HOME_RANGE)
    })

  })

})


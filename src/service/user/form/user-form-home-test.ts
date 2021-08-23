import { FormError } from '../../../lib/base/error2.js'
import { checkHomeFormat, HOME_EMPTY, HOME_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkHomeFormat', () => {
    it('no err if home valid', () => {
      const errs: FormError[] = []
      checkHomeFormat('user1', errs)
      expect(errs.length).toBe(0)
    })
    it('err if home empty', () => {
      const errs: FormError[] = []
      checkHomeFormat('', errs)
      expect(errs).toContain(HOME_EMPTY)
    })
    it('no err if home length 32', () => {
      const errs: FormError[] = []
      const home = 'c'.repeat(32)
      checkHomeFormat(home, errs)
      expect(errs.length).toBe(0)
    })
    it('err if home length 33', () => {
      const errs: FormError[] = []
      const home = 'c'.repeat(33)
      checkHomeFormat(home, errs)
      expect(errs).toContain(HOME_RANGE)
    })

  })

})


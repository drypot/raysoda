import { FormError } from '../../../lib/base/error2.js'
import { checkHomeFormat, HOME_EMPTY, HOME_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkHomeFormat', () => {

    it('ok if valid', () => {
      const errs: FormError[] = []
      checkHomeFormat('user1', errs)
      expect(errs.length).toBe(0)
    })

    it('fail if empty', () => {
      const errs: FormError[] = []
      checkHomeFormat('', errs)
      expect(errs).toContain(HOME_EMPTY)
    })

    it('ok if length 32', () => {
      const errs: FormError[] = []
      const home = 'c'.repeat(32)
      checkHomeFormat(home, errs)
      expect(errs.length).toBe(0)
    })
    it('fail if length 33', () => {
      const errs: FormError[] = []
      const home = 'c'.repeat(33)
      checkHomeFormat(home, errs)
      expect(errs).toContain(HOME_RANGE)
    })

  })

})


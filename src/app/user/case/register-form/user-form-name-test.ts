import { FormError } from '../../../../lib/base/error2.js'
import { checkNameFormat, NAME_EMPTY, NAME_RANGE } from './user-form.js'

describe('UserForm', () => {

  describe('checkNameFormat', () => {

    it('ok if valid', () => {
      const errs: FormError[] = []
      checkNameFormat('user1', errs)
      expect(errs.length).toBe(0)
    })

    it('fail if empty', () => {
      const errs: FormError[] = []
      checkNameFormat('', errs)
      expect(errs).toContain(NAME_EMPTY)
    })

    it('ok if length 32', () => {
      const errs: FormError[] = []
      const name = 'c'.repeat(32)
      checkNameFormat(name, errs)
      expect(errs.length).toBe(0)
    })
    it('fail if length 33', () => {
      const errs: FormError[] = []
      const name = 'c'.repeat(33)
      checkNameFormat(name, errs)
      expect(errs).toContain(NAME_RANGE)
    })

  })

})

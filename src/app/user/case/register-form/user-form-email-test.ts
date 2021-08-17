import { checkEmailFormat, EMAIL_EMPTY, EMAIL_RANGE } from './user-form.js'
import { FormError } from '../../../../lib/base/error2.js'

describe('UserForm', () => {

  describe('checkEmailFormat', () => {

    it('ok if valid', () => {
      const errs: FormError[] = []
      checkEmailFormat('user1@mail.test', errs)
      expect(errs.length).toBe(0)
    })

    it('fail if empty', () => {
      const errs: FormError[] = []
      checkEmailFormat('', errs)
      expect(errs).toContain(EMAIL_EMPTY)
    })

    it('fail if length 7', () => {
      const errs: FormError[] = []
      checkEmailFormat('12@45.7', errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(EMAIL_RANGE)
    })
    it('ok if length 8', () => {
      const errs: FormError[] = []
      checkEmailFormat('12@45.78', errs)
      expect(errs.length).toBe(0)
    })
    it('ok if length 64', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(54)
      checkEmailFormat(email, errs)
      expect(errs.length).toBe(0)
    })
    it('fail if length 65', () => {
      const errs: FormError[] = []
      const email = '123@567.90' + 'c'.repeat(55)
      checkEmailFormat(email, errs)
      expect(errs).toContain(EMAIL_RANGE)
    })

  })

})

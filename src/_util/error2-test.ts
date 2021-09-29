import { Error2, errorOf, findError } from './error2.js'
import { INVALID_DATA, UNKNOWN_ERROR } from '../_type/error-basic.js'

describe('error2', () => {

  describe('errorOf', () => {
    let err: Error2
    it('create err', () => {
      err = errorOf('ERR', 'Message', 'Field')
    })
    it('check err', () => {
      expect(err).toEqual({
        name: 'ERR',
        message: 'Message',
        field: 'Field'
      })
    })
    it('default errors exist', () => {
      expect(UNKNOWN_ERROR).toBeDefined()
      expect(INVALID_DATA).toBeDefined()
    })
  })

  describe('findError', () => {
    const err1 = errorOf('E1')
    const err2 = errorOf('E2')
    const err3 = errorOf('E3')
    const list = [err1, err2]
    it('check', () => {
      expect(findError(list, err1)).toBe(err1)
      expect(findError(list, err3)).toBeUndefined()
    })
  })

})

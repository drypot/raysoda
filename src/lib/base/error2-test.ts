import { errorExists, FormError, INVALID_DATA, newFormError, UNKNOWN_ERROR } from './error2.js'

describe('FormError', () => {
  it('can be created', () => {
    const err = newFormError('ERR', 'Message', 'Field')
    expect(err).toEqual({
      name: 'ERR',
      message: 'Message',
      field: 'Field'
    })
  })
})

describe('Default Errors', () => {
  it('should exist', () => {
    expect(UNKNOWN_ERROR).toBeDefined()
    expect(INVALID_DATA).toBeDefined()
  })
})

describe('errorExists', () => {
  const err1 = newFormError('E1')
  const err2 = newFormError('E2')
  const err3 = newFormError('E3')
  const errs = [ err1, err2 ]
  it('should work for object', () => {
    expect(errorExists(err1, err1)).toBe(true)
    expect(errorExists(err1, err2)).toBe(false)
  })
  it('should work for array', () => {
    expect(errorExists(err1, errs)).toBe(true)
    expect(errorExists(err3, errs)).toBe(false)
  })
})

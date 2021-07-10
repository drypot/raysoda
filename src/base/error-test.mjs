import { errorExists, FormError, INVALID_DATA, UNKNOWN_ERROR } from './error.mjs'

describe('FormError', () => {
  it('can be created', () => {
    const err = new FormError('ERR', 'Message', 'Field')
    expect(err.code).toBe('ERR')
    expect(err.message).toBe('Message')
    expect(err.field).toBe('Field')
  })
  it('can spawn new object', () => {
    const err = new FormError('ERR', 'Message', 'Field')
    const err2 = err.spawn()
    expect(err2).toEqual(err)
    err2.opt = 'OPT'
    expect(err.opt).toBeUndefined()
    expect(err2.opt).toBe('OPT')
  })
})

describe('Default Errors', () => {
  it('exists', () => {
    expect(UNKNOWN_ERROR).toBeDefined()
    expect(INVALID_DATA).toBeDefined()
  })
})

describe('errorExists', () => {
  const err1 = new FormError('E1')
  const err2 = new FormError('E2')
  const err3 = new FormError('E3')
  const errs = [ err1, err2 ]
  it('should work for single', () => {
    expect(errorExists(err1, err1)).toBe(true)
    expect(errorExists(err2, err1)).toBe(false)
  })
  it('should work for array', () => {
    expect(errorExists(errs, err1)).toBe(true)
    expect(errorExists(errs, err3)).toBe(false)
  })
})

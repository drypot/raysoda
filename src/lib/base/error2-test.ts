import { lookupErrors, FormError, INVALID_DATA, UNKNOWN_ERROR } from './error2.js'

describe('FormError', () => {
  it('can be created', () => {
    const err = new FormError('ERR', 'Message', 'Field')
    expect(err.name).toBe('ERR')
    expect(err.message).toBe('Message')
    expect(err.field).toBe('Field')
  })
  it('can be spawned', () => {
    const err = new FormError('ERR', 'Message', 'Field')
    const err2 = err.spawn()
    expect(err2).toEqual(err)
  })
})

describe('Default Errors', () => {
  it('should exist', () => {
    expect(UNKNOWN_ERROR).toBeDefined()
    expect(INVALID_DATA).toBeDefined()
  })
})

describe('lookupErrors', () => {
  const err1 = new FormError('E1')
  const err2 = new FormError('E2')
  const err3 = new FormError('E3')
  const errs = [ err1, err2 ]
  it('should work for object', () => {
    expect(lookupErrors(err1, err1)).toBe(true)
    expect(lookupErrors(err2, err1)).toBe(false)
  })
  it('should work for array', () => {
    expect(lookupErrors(errs, err1)).toBe(true)
    expect(lookupErrors(errs, err3)).toBe(false)
  })
})

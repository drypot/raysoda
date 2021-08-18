import { FormError, formErrorExists, formErrorOf, INVALID_DATA, UNKNOWN_ERROR } from './error2.js'

describe('formErrorOf', () => {
  let err: FormError
  it('create err', () => {
    err = formErrorOf('ERR', 'Message', 'Field')
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

describe('formErrorExists', () => {
  const err1 = formErrorOf('E1')
  const err2 = formErrorOf('E2')
  const err3 = formErrorOf('E3')
  const errs = [ err1, err2 ]
  it('check', () => {
    expect(formErrorExists(err1, err1)).toBe(true)
    expect(formErrorExists(err2, err1)).toBe(false)
    expect(formErrorExists(errs, err1)).toBe(true)
    expect(formErrorExists(errs, err3)).toBe(false)
  })
})

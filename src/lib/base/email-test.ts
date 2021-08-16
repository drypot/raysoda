import { emailPatternIsOk } from './email.js'

describe('emailPatternIsOk', () => {

  it('must be true if mail is correct', () => {
    expect(emailPatternIsOk('drypot@mail.test')).toBe(true)
  })
  it('must be true with .', () => {
    expect(emailPatternIsOk('develop.bj@mail.test')).toBe(true)
  })
  it('must be true with -', () => {
    expect(emailPatternIsOk('-a-b-c_d-e-f@mail.test')).toBe(true)
  })
  it('must be false if mail is incorrect', () => {
    expect(emailPatternIsOk('abc.mail.test')).toBe(false)
  })
  it('must be false with *', () => {
    expect(emailPatternIsOk('abc*xyz@mail.test')).toBe(false)
  })

})

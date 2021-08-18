import { emailPatternIsOk } from './email.js'

describe('emailPatternIsOk', () => {

  it('true if mail is correct', () => {
    expect(emailPatternIsOk('drypot@mail.test')).toBe(true)
  })
  it('true with .', () => {
    expect(emailPatternIsOk('develop.bj@mail.test')).toBe(true)
  })
  it('true with -', () => {
    expect(emailPatternIsOk('-a-b-c_d-e-f@mail.test')).toBe(true)
  })
  it('false if mail is incorrect', () => {
    expect(emailPatternIsOk('abc.mail.test')).toBe(false)
  })
  it('false with *', () => {
    expect(emailPatternIsOk('abc*xyz@mail.test')).toBe(false)
  })

})

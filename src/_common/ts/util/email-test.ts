import { emailPatternIsOk } from './email'

describe('emailPatternIsOk', () => {
  it('correct mail', () => {
    expect(emailPatternIsOk('drypot@mail.test')).toBe(true)
  })
  it('with .', () => {
    expect(emailPatternIsOk('develop.bj@mail.test')).toBe(true)
  })
  it('with -', () => {
    expect(emailPatternIsOk('-a-b-c_d-e-f@mail.test')).toBe(true)
  })
  it('incorrect mail', () => {
    expect(emailPatternIsOk('abc.mail.test')).toBe(false)
  })
  it('with *', () => {
    expect(emailPatternIsOk('abc*xyz@mail.test')).toBe(false)
  })
})

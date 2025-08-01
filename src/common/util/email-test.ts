import { emailGetUserName, emailPatternIsOk } from './email.js'

describe('emailPatternIsOk', () => {
  it('normal ok', () => {
    expect(emailPatternIsOk('drypot@mail.test')).toBe(true)
  })
  it('with A-Z ok', () => {
    expect(emailPatternIsOk('DRYPOT@mail.test')).toBe(true)
  })
  it('with . ok', () => {
    expect(emailPatternIsOk('develop.bj@mail.test')).toBe(true)
  })
  it('with - ok', () => {
    expect(emailPatternIsOk('-a-b-c_d-e-f@mail.test')).toBe(true)
  })
  it('with * fail', () => {
    expect(emailPatternIsOk('abc*xyz@mail.test')).toBe(false)
  })
  it('no @ fail', () => {
    expect(emailPatternIsOk('abc.mail.test')).toBe(false)
  })
})

describe('emailGetUserName', () => {
  it('normal ok', () => {
    expect(emailGetUserName('drypot@mail.test')).toBe('drypot')
  })
  it('with A-Z ok', () => {
    expect(emailGetUserName('DRYPOT@mail.test')).toBe('DRYPOT')
  })
  it('with - ok', () => {
    expect(emailGetUserName('-a-b-c_d-e-f@mail.test')).toBe('-a-b-c_d-e-f')
  })
  it('with * fail', () => {
    expect(emailGetUserName('abc*xyz@mail.test')).toBeUndefined()
  })
  it('no @ fail', () => {
    expect(emailGetUserName('abc.mail.test')).toBeUndefined()
  })
})

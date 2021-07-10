import { genDateString, genDateStringNoDash, genDateTimeString, genDate, genDateFrom } from './date.mjs'

describe('getDate', () => {
  it('should succeed', () => {
    const now = new Date()
    const today = genDate()
    expect(today.getFullYear()).toBe(now.getFullYear())
    expect(today.getMonth()).toBe(now.getMonth())
    expect(today.getDate()).toBe(now.getDate())
    expect(today.getHours()).toBe(0)
    expect(today.getMinutes()).toBe(0)
    expect(today.getSeconds()).toBe(0)
    expect(today.getMilliseconds()).toBe(0)
  })
})

describe('getDateFrom', () => {
  it('should succeed', () => {
    const d = genDateFrom('1974-05-16')
    expect(d.getFullYear()).toBe(1974)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(16)
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })
})

describe('dateTimeString', () => {
  it('should succeed', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(genDateTimeString(d)).toBe('1974-05-16 12:00:00')
  })
})

describe('dateString', () => {
  it('should succeed', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(genDateString(d)).toBe('1974-05-16')
  })
})

describe('dateStringNoDash', () => {
  it('should succeed', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(genDateStringNoDash(d)).toBe('19740516')
  })
})

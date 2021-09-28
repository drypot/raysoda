import { dateFrom, dateNoDashStringFrom, dateStringFrom, dateTimeFrom, dateTimeStringFrom, today } from './date2.js'

describe('today', () => {
  it('check', () => {
    const now = new Date()
    const d = today()
    expect(d.getFullYear()).toBe(now.getFullYear())
    expect(d.getMonth()).toBe(now.getMonth())
    expect(d.getDate()).toBe(now.getDate())
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })
})

describe('dateTimeFrom', () => {
  it('check', () => {
    const d = dateTimeFrom('1974-05-16 15:30:45') as Date
    expect(d.getFullYear()).toBe(1974)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(16)
    expect(d.getHours()).toBe(15)
    expect(d.getMinutes()).toBe(30)
    expect(d.getSeconds()).toBe(45)
    expect(d.getMilliseconds()).toBe(0)
  })
  it('check null', () => {
    expect(dateFrom('null')).toBeNull()
    expect(dateFrom('undefined')).toBeNull()
  })
})

describe('dateFrom', () => {
  it('check', () => {
    const d = dateFrom('1974-05-16') as Date
    expect(d.getFullYear()).toBe(1974)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(16)
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })
})

describe('dateTimeStringFrom', () => {
  it('check', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateTimeStringFrom(d)).toBe('1974-05-16 12:00:00')
  })
})

describe('dateStringFrom', () => {
  it('check', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateStringFrom(d)).toBe('1974-05-16')
  })
})

describe('dateNoDashStringFrom', () => {
  it('check', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateNoDashStringFrom(d)).toBe('19740516')
  })
})

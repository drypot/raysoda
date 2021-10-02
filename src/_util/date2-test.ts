import {
  anyToDate,
  anyToDateTime,
  dateToStringDate,
  dateToStringDateNoDash,
  dateToStringDateTime,
  newDateToday
} from './date2.js'

describe('newDateToday', () => {
  it('1', () => {
    const now = new Date()
    const d = newDateToday()
    expect(d.getFullYear()).toBe(now.getFullYear())
    expect(d.getMonth()).toBe(now.getMonth())
    expect(d.getDate()).toBe(now.getDate())
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })
})

describe('anyToDateTime', () => {
  it('case 1', () => {
    const d = anyToDateTime('1974-05-16 15:30:45') as Date
    expect(d.getFullYear()).toBe(1974)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(16)
    expect(d.getHours()).toBe(15)
    expect(d.getMinutes()).toBe(30)
    expect(d.getSeconds()).toBe(45)
    expect(d.getMilliseconds()).toBe(0)
  })
  it('case null', () => {
    expect(anyToDate('null')).toBeNull()
    expect(anyToDate('undefined')).toBeNull()
  })
})

describe('anyToDate', () => {
  it('case 1', () => {
    const d = anyToDate('1974-05-16') as Date
    expect(d.getFullYear()).toBe(1974)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(16)
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })
})

describe('dateToStringDateTime', () => {
  it('case 1', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateToStringDateTime(d)).toBe('1974-05-16 12:00:00')
  })
})

describe('dateToStringDate', () => {
  it('case 1', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateToStringDate(d)).toBe('1974-05-16')
  })
})

describe('dateNoDashStringFrom', () => {
  it('case 1', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateToStringDateNoDash(d)).toBe('19740516')
  })
})

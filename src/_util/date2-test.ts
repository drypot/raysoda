import {
  dateToDateString,
  dateToDateStringNoDash,
  dateToDateTimeString,
  getDateToday,
  stringToDate,
  stringToDateTime
} from './date2.js'

describe('getDateToday', () => {
  it('1', () => {
    const now = new Date()
    const d = getDateToday()
    expect(d.getFullYear()).toBe(now.getFullYear())
    expect(d.getMonth()).toBe(now.getMonth())
    expect(d.getDate()).toBe(now.getDate())
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })
})

describe('stringToDateTime', () => {
  it('case 1', () => {
    const d = stringToDateTime('1974-05-16 15:30:45') as Date
    expect(d.getFullYear()).toBe(1974)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(16)
    expect(d.getHours()).toBe(15)
    expect(d.getMinutes()).toBe(30)
    expect(d.getSeconds()).toBe(45)
    expect(d.getMilliseconds()).toBe(0)
  })
  it('case null', () => {
    expect(stringToDate('null')).toBeNull()
    expect(stringToDate('undefined')).toBeNull()
  })
})

describe('stringToDate', () => {
  it('case 1', () => {
    const d = stringToDate('1974-05-16') as Date
    expect(d.getFullYear()).toBe(1974)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(16)
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })
})

describe('dateToDateTimeString', () => {
  it('case 1', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateToDateTimeString(d)).toBe('1974-05-16 12:00:00')
  })
})

describe('dateToDateString', () => {
  it('case 1', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateToDateString(d)).toBe('1974-05-16')
  })
})

describe('dateNoDashStringFrom', () => {
  it('case 1', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateToDateStringNoDash(d)).toBe('19740516')
  })
})

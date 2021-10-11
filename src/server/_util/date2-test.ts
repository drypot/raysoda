import { newDate, newDateString, newDateStringNoTime, newDateStringNoTimeNoDash, newTimeZeroDate, } from './date2.js'

describe('newDate', () => {
  it('case 1', () => {
    const d = newDate('1974-05-16 15:30:45') as Date
    expect(d.getFullYear()).toBe(1974)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(16)
    expect(d.getHours()).toBe(15)
    expect(d.getMinutes()).toBe(30)
    expect(d.getSeconds()).toBe(45)
    expect(d.getMilliseconds()).toBe(0)
  })
  it('case null', () => {
    expect(newTimeZeroDate('null')).toBeNull()
    expect(newTimeZeroDate('undefined')).toBeNull()
  })
})

describe('newTimeZeroDate', () => {
  it('case 1', () => {
    const d = newTimeZeroDate('1974-05-16') as Date
    expect(d.getFullYear()).toBe(1974)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(16)
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })
})

describe('newDateString', () => {
  it('case 1', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(newDateString(d)).toBe('1974-05-16 12:00:00')
  })
})

describe('newDateStringNoTime', () => {
  it('case 1', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(newDateStringNoTime(d)).toBe('1974-05-16')
  })
})

describe('newDateStringNoTimeNoDash', () => {
  it('case 1', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(newDateStringNoTimeNoDash(d)).toBe('19740516')
  })
})

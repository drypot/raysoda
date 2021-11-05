import {
  dateDiffDays,
  dateDiffHours,
  dateDiffMins,
  dateDiffMs,
  dateDiffSecond,
  dateToString,
  dateToStringNoTime,
  dateToStringNoTimeNoDash,
  parseDate,
  setTimeZero
} from '@common/util/date2'

describe('newDate', () => {
  it('should work', () => {
    const d = parseDate('1974-05-16 15:30:45') as Date
    expect(d.getFullYear()).toBe(1974)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(16)
    expect(d.getHours()).toBe(15)
    expect(d.getMinutes()).toBe(30)
    expect(d.getSeconds()).toBe(45)
    expect(d.getMilliseconds()).toBe(0)
  })
  it('case null', () => {
    expect(parseDate('null')).toBeNull()
    expect(parseDate('undefined')).toBeNull()
  })
})

describe('setTimeZero', () => {
  it('should work', () => {
    const d = parseDate('1974-05-16') as Date
    setTimeZero(d)
    expect(d.getFullYear()).toBe(1974)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(16)
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })
})

describe('dateToString', () => {
  it('should work', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateToString(d)).toBe('1974-05-16 12:00:00')
  })
})

describe('dateToStringNoTime', () => {
  it('should work', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateToStringNoTime(d)).toBe('1974-05-16')
  })
})

describe('dateToStringNoTimeNoDash', () => {
  it('should work', () => {
    const d = new Date(1974, 4, 16, 12, 0)
    expect(dateToStringNoTimeNoDash(d)).toBe('19740516')
  })
})

describe('dateDiffMs', () => {
  it('should work', () => {
    const a = new Date('2021-10.28 01:00:03')
    const b = new Date('2021-10.28 01:00:00')
    expect(dateDiffMs(a, b)).toBe(3 * 1000)
  })
})

describe('dateDiffSecond', () => {
  it('should work', () => {
    const a = new Date(2021, 9, 28, 1, 0, 3, 0)
    const b = new Date(2021, 9, 28, 1, 0, 0, 0)
    expect(dateDiffSecond(a, b)).toBe(3)
  })
  it('should work 2', () => {
    const a = new Date(2021, 9, 28, 1, 0, 3, 100)
    const b = new Date(2021, 9, 28, 1, 0, 0, 0)
    expect(dateDiffSecond(a, b)).toBe(4)
  })
})

describe('dateDiffMins', () => {
  it('should work', () => {
    const a = new Date('2021-10.28 01:03:00')
    const b = new Date('2021-10.28 01:00:00')
    expect(dateDiffMins(a, b)).toBe(3)
  })
  it('should work 2', () => {
    const a = new Date('2021-10.28 01:03:01')
    const b = new Date('2021-10.28 01:00:00')
    expect(dateDiffMins(a, b)).toBe(4)
  })
})

describe('dateDiffHours', () => {
  it('should work', () => {
    const a = new Date('2021-10.28 04:00')
    const b = new Date('2021-10.28 01:00')
    expect(dateDiffHours(a, b)).toBe(3)
  })
  it('should work 2', () => {
    const a = new Date('2021-10.28 04:01')
    const b = new Date('2021-10.28 01:00')
    expect(dateDiffHours(a, b)).toBe(4)
  })
})

describe('dateDiffDays', () => {
  it('should work', () => {
    const a = new Date('2021-10.31 00:00')
    const b = new Date('2021-10.28 00:00')
    expect(dateDiffDays(a, b)).toBe(3)
  })
  it('should work 2', () => {
    const a = new Date('2021-10.31 01:00')
    const b = new Date('2021-10.28 00:00')
    expect(dateDiffDays(a, b)).toBe(4)
  })
})

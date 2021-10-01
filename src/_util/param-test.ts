import { limitNumber, paramToLimitedNumber, paramToNumber, paramToString } from './param.js'

describe('limitNumber', () => {
  it('1', () => {
    expect(limitNumber(10, 1, 100)).toBe(10)
    expect(limitNumber(-10, 1, 100)).toBe(1)
    expect(limitNumber(1000, 1, 100)).toBe(100)
    expect(limitNumber(-10, NaN, 100)).toBe(-10)
    expect(limitNumber(1000, 1, NaN)).toBe(1000)
  })
})

describe('paramToNumber', () => {
  it('number', () => {
    expect(paramToNumber(0)).toBe(0)
    expect(paramToNumber(0, 3)).toBe(0)
    expect(paramToNumber(1)).toBe(1)
    expect(paramToNumber(1, 3)).toBe(1)
  })
  it('string', () => {
    expect(paramToNumber('')).toBe(0)
    expect(paramToNumber('', 3)).toBe(3)
    expect(paramToNumber('0')).toBe(0)
    expect(paramToNumber('0', 3)).toBe(0)
    expect(paramToNumber('1')).toBe(1)
    expect(paramToNumber('1', 3)).toBe(1)
  })
  it('object', () => {
    expect(paramToNumber({})).toBe(0)
    expect(paramToNumber({}, 3)).toBe(3)
  })
  it('null', () => {
    expect(paramToNumber(null)).toBe(0)
    expect(paramToNumber(null, 3)).toBe(3)
  })
  it('undefined', () => {
    expect(paramToNumber(undefined)).toBe(0)
    expect(paramToNumber(undefined, 3)).toBe(3)
  })
})

describe('paramToLimitedNumber', () => {
  it('1', () => {
    expect(paramToLimitedNumber(null, 10, 1, 100)).toBe(10)
    expect(paramToLimitedNumber('null', 10, 1, 100)).toBe(10)
    expect(paramToLimitedNumber('20', 10, 1, 100)).toBe(20)
    expect(paramToLimitedNumber('200', 10, 1, 100)).toBe(100)
  })
})

describe('paramToString', () => {
  it('number', () => {
    expect(paramToString(0)).toBe('0')
    expect(paramToString(0, '3')).toBe('0')
    expect(paramToString(1)).toBe('1')
    expect(paramToString(1, '3')).toBe('1')
  })
  it('string', () => {
    expect(paramToString('')).toBe('')
    expect(paramToString('', '3')).toBe('')
    expect(paramToString('1')).toBe('1')
    expect(paramToString('1', '3')).toBe('1')
  })
  it('object', () => {
    expect(paramToString({})).toBe('[object Object]')
    expect(paramToString({}, '3')).toBe('[object Object]')
  })
  it('null', () => {
    expect(paramToString(null)).toBe('')
    expect(paramToString(null, '3')).toBe('3')
  })
  it('undefined', () => {
    expect(paramToString(undefined)).toBe('')
    expect(paramToString(undefined, '3')).toBe('3')
  })
})

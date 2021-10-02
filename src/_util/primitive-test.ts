import { anyToLimitedNumber, anyToNumber, anyToString, limitNumber } from './primitive.js'

describe('limitNumber', () => {
  it('1', () => {
    expect(limitNumber(10, 1, 100)).toBe(10)
    expect(limitNumber(-10, 1, 100)).toBe(1)
    expect(limitNumber(1000, 1, 100)).toBe(100)
    expect(limitNumber(-10, NaN, 100)).toBe(-10)
    expect(limitNumber(1000, 1, NaN)).toBe(1000)
  })
})

describe('anyToNumber', () => {
  it('number', () => {
    expect(anyToNumber(0)).toBe(0)
    expect(anyToNumber(0, 3)).toBe(0)
    expect(anyToNumber(1)).toBe(1)
    expect(anyToNumber(1, 3)).toBe(1)
  })
  it('string', () => {
    expect(anyToNumber('')).toBe(0)
    expect(anyToNumber('', 3)).toBe(3)
    expect(anyToNumber('0')).toBe(0)
    expect(anyToNumber('0', 3)).toBe(0)
    expect(anyToNumber('1')).toBe(1)
    expect(anyToNumber('1', 3)).toBe(1)
  })
  it('object', () => {
    expect(anyToNumber({})).toBe(0)
    expect(anyToNumber({}, 3)).toBe(3)
  })
  it('null', () => {
    expect(anyToNumber(null)).toBe(0)
    expect(anyToNumber(null, 3)).toBe(3)
  })
  it('undefined', () => {
    expect(anyToNumber(undefined)).toBe(0)
    expect(anyToNumber(undefined, 3)).toBe(3)
  })
})

describe('anyToLimitedNumber', () => {
  it('1', () => {
    expect(anyToLimitedNumber(null, 10, 1, 100)).toBe(10)
    expect(anyToLimitedNumber('null', 10, 1, 100)).toBe(10)
    expect(anyToLimitedNumber('20', 10, 1, 100)).toBe(20)
    expect(anyToLimitedNumber('200', 10, 1, 100)).toBe(100)
  })
})

describe('anyToString', () => {
  it('number', () => {
    expect(anyToString(0)).toBe('0')
    expect(anyToString(0, '3')).toBe('0')
    expect(anyToString(1)).toBe('1')
    expect(anyToString(1, '3')).toBe('1')
  })
  it('string', () => {
    expect(anyToString('')).toBe('')
    expect(anyToString('', '3')).toBe('')
    expect(anyToString('1')).toBe('1')
    expect(anyToString('1', '3')).toBe('1')
  })
  it('object', () => {
    expect(anyToString({})).toBe('[object Object]')
    expect(anyToString({}, '3')).toBe('[object Object]')
  })
  it('null', () => {
    expect(anyToString(null)).toBe('')
    expect(anyToString(null, '3')).toBe('3')
  })
  it('undefined', () => {
    expect(anyToString(undefined)).toBe('')
    expect(anyToString(undefined, '3')).toBe('3')
  })
})

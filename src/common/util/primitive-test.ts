import { limitNumber, newLimitedNumber, newNumber, newString } from './primitive.ts'

describe('limitNumber', () => {
  it('1', () => {
    expect(limitNumber(10, 1, 100)).toBe(10)
    expect(limitNumber(-10, 1, 100)).toBe(1)
    expect(limitNumber(1000, 1, 100)).toBe(100)
    expect(limitNumber(-10, NaN, 100)).toBe(-10)
    expect(limitNumber(1000, 1, NaN)).toBe(1000)
  })
})

describe('newNumber', () => {
  it('number', () => {
    expect(newNumber(0)).toBe(0)
    expect(newNumber(0, 3)).toBe(0)
    expect(newNumber(1)).toBe(1)
    expect(newNumber(1, 3)).toBe(1)
  })
  it('string', () => {
    expect(newNumber('')).toBe(0)
    expect(newNumber('', 3)).toBe(3)
    expect(newNumber('0')).toBe(0)
    expect(newNumber('0', 3)).toBe(0)
    expect(newNumber('1')).toBe(1)
    expect(newNumber('1', 3)).toBe(1)
  })
  it('object', () => {
    expect(newNumber({})).toBe(0)
    expect(newNumber({}, 3)).toBe(3)
  })
  it('null', () => {
    expect(newNumber(null)).toBe(0)
    expect(newNumber(null, 3)).toBe(3)
  })
  it('undefined', () => {
    expect(newNumber(undefined)).toBe(0)
    expect(newNumber(undefined, 3)).toBe(3)
  })
})

describe('newLimitedNumber', () => {
  it('1', () => {
    expect(newLimitedNumber(null, 10, 1, 100)).toBe(10)
    expect(newLimitedNumber('null', 10, 1, 100)).toBe(10)
    expect(newLimitedNumber('20', 10, 1, 100)).toBe(20)
    expect(newLimitedNumber('200', 10, 1, 100)).toBe(100)
  })
})

describe('newString', () => {
  it('number', () => {
    expect(newString(0)).toBe('0')
    expect(newString(0, '3')).toBe('0')
    expect(newString(1)).toBe('1')
    expect(newString(1, '3')).toBe('1')
  })
  it('string', () => {
    expect(newString('')).toBe('')
    expect(newString('', '3')).toBe('')
    expect(newString('1')).toBe('1')
    expect(newString('1', '3')).toBe('1')
  })
  it('object', () => {
    expect(newString({})).toBe('[object Object]')
    expect(newString({}, '3')).toBe('[object Object]')
  })
  it('null', () => {
    expect(newString(null)).toBe('')
    expect(newString(null, '3')).toBe('3')
  })
  it('undefined', () => {
    expect(newString(undefined)).toBe('')
    expect(newString(undefined, '3')).toBe('3')
  })
})

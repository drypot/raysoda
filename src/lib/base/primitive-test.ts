import { limitNumber, numberFrom, stringFrom } from './primitive.js'

describe('putInRange', () => {
  it('check', () => {
    expect(limitNumber(10, 1, 100)).toBe(10)
    expect(limitNumber(-10, 1, 100)).toBe(1)
    expect(limitNumber(1000, 1, 100)).toBe(100)
    expect(limitNumber(-10, NaN, 100)).toBe(-10)
    expect(limitNumber(1000, 1, NaN)).toBe(1000)
  })
})

describe('numberFrom', () => {
  it('check from number', () => {
    expect(numberFrom(0)).toBe(0)
    expect(numberFrom(0, 3)).toBe(0)
    expect(numberFrom(1)).toBe(1)
    expect(numberFrom(1, 3)).toBe(1)
  })
  it('check from string', () => {
    expect(numberFrom('')).toBe(0)
    expect(numberFrom('', 3)).toBe(3)
    expect(numberFrom('0')).toBe(0)
    expect(numberFrom('0', 3)).toBe(0)
    expect(numberFrom('1')).toBe(1)
    expect(numberFrom('1', 3)).toBe(1)
  })
  it('check from object', () => {
    expect(numberFrom({})).toBe(0)
    expect(numberFrom({}, 3)).toBe(3)
  })
  it('check from null', () => {
    expect(numberFrom(null)).toBe(0)
    expect(numberFrom(null, 3)).toBe(3)
  })
  it('check from undefined', () => {
    expect(numberFrom(undefined)).toBe(0)
    expect(numberFrom(undefined, 3)).toBe(3)
  })
})

describe('stringFrom', () => {
  it('check from number', () => {
    expect(stringFrom(0)).toBe('0')
    expect(stringFrom(0, '3')).toBe('0')
    expect(stringFrom(1)).toBe('1')
    expect(stringFrom(1, '3')).toBe('1')
  })
  it('check from string', () => {
    expect(stringFrom('')).toBe('')
    expect(stringFrom('', '3')).toBe('')
    expect(stringFrom('1')).toBe('1')
    expect(stringFrom('1', '3')).toBe('1')
  })
  it('check from object', () => {
    expect(stringFrom({})).toBe('[object Object]')
    expect(stringFrom({}, '3')).toBe('[object Object]')
  })
  it('check from null', () => {
    expect(stringFrom(null)).toBe('')
    expect(stringFrom(null, '3')).toBe('3')
  })
  it('check from undefined', () => {
    expect(stringFrom(undefined)).toBe('')
    expect(stringFrom(undefined, '3')).toBe('3')
  })
})

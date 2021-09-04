import { limitNumber } from './number2.js'

describe('putInRange', () => {
  it('check', () => {
    expect(limitNumber(10, 1, 100)).toBe(10)
    expect(limitNumber(-10, 1, 100)).toBe(1)
    expect(limitNumber(1000, 1, 100)).toBe(100)
    expect(limitNumber(-10, NaN, 100)).toBe(-10)
    expect(limitNumber(1000, 1, NaN)).toBe(1000)
  })
})

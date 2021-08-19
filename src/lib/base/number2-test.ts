import { putInRange } from './number2.js'

describe('putInRange', () => {
  it('check', () => {
    expect(putInRange(10, 1, 100)).toBe(10)
    expect(putInRange(-10, 1, 100)).toBe(1)
    expect(putInRange(1000, 1, 100)).toBe(100)
    expect(putInRange(-10, NaN, 100)).toBe(-10)
    expect(putInRange(1000, 1, NaN)).toBe(1000)
  })
})

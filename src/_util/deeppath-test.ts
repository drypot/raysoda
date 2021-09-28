import { deepPathOf } from './deeppath.js'

describe('deepPathOf', () => {
  it('check', () => {
    expect(deepPathOf(1, 3)).toBe('0/0/1')
    expect(deepPathOf(999, 3)).toBe('0/0/999')
    expect(deepPathOf(1000, 3)).toBe('0/1/0')
    expect(deepPathOf(1999, 3)).toBe('0/1/999')
    expect(deepPathOf(999999, 3)).toBe('0/999/999')
    expect(deepPathOf(1999999, 3)).toBe('1/999/999')
    expect(deepPathOf(999999999, 3)).toBe('999/999/999')
    expect(deepPathOf(9999999999, 3)).toBe('9999/999/999')
  })
})


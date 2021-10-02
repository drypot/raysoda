import { newDeepPath } from './deeppath.js'

describe('newDeepPath', () => {
  it('1', () => {
    expect(newDeepPath(1, 3)).toBe('0/0/1')
    expect(newDeepPath(999, 3)).toBe('0/0/999')
    expect(newDeepPath(1000, 3)).toBe('0/1/0')
    expect(newDeepPath(1999, 3)).toBe('0/1/999')
    expect(newDeepPath(999999, 3)).toBe('0/999/999')
    expect(newDeepPath(1999999, 3)).toBe('1/999/999')
    expect(newDeepPath(999999999, 3)).toBe('999/999/999')
    expect(newDeepPath(9999999999, 3)).toBe('9999/999/999')
  })
})


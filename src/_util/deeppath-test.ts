import { getDeepPath } from './deeppath.js'

describe('getDeepPath', () => {
  it('1', () => {
    expect(getDeepPath(1, 3)).toBe('0/0/1')
    expect(getDeepPath(999, 3)).toBe('0/0/999')
    expect(getDeepPath(1000, 3)).toBe('0/1/0')
    expect(getDeepPath(1999, 3)).toBe('0/1/999')
    expect(getDeepPath(999999, 3)).toBe('0/999/999')
    expect(getDeepPath(1999999, 3)).toBe('1/999/999')
    expect(getDeepPath(999999999, 3)).toBe('999/999/999')
    expect(getDeepPath(9999999999, 3)).toBe('9999/999/999')
  })
})


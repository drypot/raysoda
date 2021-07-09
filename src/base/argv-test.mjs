import { parseArgv } from './argv.mjs'

describe('parseArgv', () => {
  it('should succeed', () => {
    const argv = ''.split(' ')
    const expected = {
      _: [],
    }
    expect(parseArgv(argv)).toEqual(expected)
  })
  it('should succeed', () => {
    const argv = '-a a1 -b b1'.split(' ')
    const expected = {
      _: [],
      a: 'a1',
      b: 'b1'
    }
    expect(parseArgv(argv)).toEqual(expected)
  })
  it('should succeed', () => {
    const argv = '-a a1 -b b1 p1 p2 p3'.split(' ')
    const expected = {
      _: ['p1', 'p2', 'p3'],
      a: 'a1',
      b: 'b1'
    }
    expect(parseArgv(argv)).toEqual(expected)
  })
  it('should succeed', () => {
    const argv = '-a a1 --ccc c1 --ddd -e e1 p1'.split(' ')
    const expected = {
      _: [ 'p1' ],
      a: 'a1',
      ccc: 'c1',
      ddd: true,
      e: 'e1',
    }
    expect(parseArgv(argv)).toEqual(expected)
  })
})

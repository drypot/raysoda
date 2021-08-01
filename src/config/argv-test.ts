import { Argv, parseArgv } from './argv.js'

describe('parseArgv', () => {
  it('should work with empty', () => {
    const argv = ''.split(' ')
    const expected = new Argv()
    expect(parseArgv(argv)).toEqual(expected)
  })
  it('should work with options', () => {
    const argv = '-a a1 -b b1'.split(' ')
    const expected = new Argv();
    expected.opts = {
      a: 'a1',
      b: 'b1'
    }
    expected.params = []
    expect(parseArgv(argv)).toEqual(expected)
  })
  it('should work with options and params', () => {
    const argv = '-a a1 -b b1 p1 p2 p3'.split(' ')
    const expected = new Argv();
    expected.opts = {
      a: 'a1',
      b: 'b1'
    }
    expected.params = ['p1', 'p2', 'p3']
    expect(parseArgv(argv)).toEqual(expected)
  })
  it('should work with double dash options', () => {
    const argv = '-a a1 --ccc c1 --ddd -e e1 p1'.split(' ')
    const expected = new Argv();
    expected.opts = {
      a: 'a1',
      ccc: 'c1',
      ddd: true,
      e: 'e1',
    }
    expected.params = [ 'p1' ]
    expect(parseArgv(argv)).toEqual(expected)
  })
  it('has possibility of error', () => {
    const argv = '-a a1 -b p1 p2 p3'.split(' ')
    const expected = new Argv();
    expected.opts = {
      a: 'a1',
      b: 'p1' // not true
    }
    expected.params = ['p2', 'p3']
    expect(parseArgv(argv)).toEqual(expected)
  })
})

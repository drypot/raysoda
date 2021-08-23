import { dupeOf } from './object2.js'

describe('Object 2', () => {

  describe('plainObjectFrom', () => {
    it('check', () => {
      const src = { a: 10 }
      const obj = dupeOf(src)
      expect(obj).toEqual(src)
      expect(obj).not.toBe(src)
    })
    it('check', () => {
      const src = { a: 10, child: { b: 20 } }
      const obj = dupeOf(src)
      expect(obj).toEqual(src)
      expect(obj).not.toBe(src)
      expect(obj.child).not.toBe(src.child)
    })
    it('check', () => {
      const src = {}
      const obj = dupeOf(src)
      expect(obj).toEqual(src)
      expect(obj).not.toBe(src)
    })
    it('check', () => {
      const src = [ 10, 20, 30 ]
      const obj = dupeOf(src)
      expect(obj).toEqual(src)
      expect(obj).not.toBe(src)
    })
    it('check', () => {
      const src = [ 10, { b: 20 } ]
      const obj = dupeOf(src)
      expect(obj).toEqual(src)
      expect(obj).not.toBe(src)
      expect(obj[1]).not.toBe(src[1])
    })
    it('check', () => {
      const src: any[] = []
      const obj = dupeOf(src)
      expect(obj).toEqual(src)
      expect(obj).not.toBe(src)
    })
    it('check', () => {
      expect(dupeOf(10)).toBe(10)
      expect(dupeOf('abc')).toBe('abc')
      expect(dupeOf(null)).toBe(null)
      expect(dupeOf(undefined)).toBe(undefined)
    })
  })

})

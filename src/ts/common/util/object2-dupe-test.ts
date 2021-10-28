import { dupe } from '@common/util/object2'

describe('dupe', () => {
  it('object', () => {
    const src = { a: 10 }
    const obj = dupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
  })
  it('object with child', () => {
    const src = { a: 10, child: { b: 20 } }
    const obj = dupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
    expect(obj.child).not.toBe(src.child)
  })
  it('empty object', () => {
    const src = {}
    const obj = dupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
  })
  it('array', () => {
    const src = [10, 20, 30]
    const obj = dupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
  })
  it('array with object element', () => {
    const src = [10, { b: 20 }]
    const obj = dupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
    expect(obj[1]).not.toBe(src[1])
  })
  it('empty array', () => {
    const src: any[] = []
    const obj = dupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
  })
  it('number, string, null, undefined', () => {
    expect(dupe(10)).toBe(10)
    expect(dupe('abc')).toBe('abc')
    expect(dupe(null)).toBe(null)
    expect(dupe(undefined)).toBe(undefined)
  })
  it('Date', () => {
    const src = new Date()
    const obj = dupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
  })
})

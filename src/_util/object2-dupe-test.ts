import { getDupe } from './object2.js'

describe('getDupe', () => {
  it('object', () => {
    const src = { a: 10 }
    const obj = getDupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
  })
  it('object with child', () => {
    const src = { a: 10, child: { b: 20 } }
    const obj = getDupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
    expect(obj.child).not.toBe(src.child)
  })
  it('empty object', () => {
    const src = {}
    const obj = getDupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
  })
  it('array', () => {
    const src = [10, 20, 30]
    const obj = getDupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
  })
  it('array with object element', () => {
    const src = [10, { b: 20 }]
    const obj = getDupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
    expect(obj[1]).not.toBe(src[1])
  })
  it('empty array', () => {
    const src: any[] = []
    const obj = getDupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
  })
  it('number, string, null, undefined', () => {
    expect(getDupe(10)).toBe(10)
    expect(getDupe('abc')).toBe('abc')
    expect(getDupe(null)).toBe(null)
    expect(getDupe(undefined)).toBe(undefined)
  })
  it('Date', () => {
    const src = new Date()
    const obj = getDupe(src)
    expect(obj).toEqual(src)
    expect(obj).not.toBe(src)
  })
})

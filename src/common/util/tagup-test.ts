import { tagUp } from './tagup.js'

describe('tagUp', () => {
  it('normal string', () => {
    const org = 'hello world'
    const result = tagUp(org)
    expect(result).toBe('hello world')
  })
  it('with link', () => {
    const org = 'aaa https://raysoda.com/abc def'
    const result = tagUp(org)
    expect(result).toBe('aaa <a href="https://raysoda.com/abc" target="_blank">https://raysoda.com/abc</a> def')
  })
})

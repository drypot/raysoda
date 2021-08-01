import { UrlMaker } from './url.js'

describe('UrlMaker', () => {
  it('works with only url', () => {
    const url = new UrlMaker('/thread').gen()
    expect(url).toBe('/thread')
  })
  it('works with query param', () => {
    const url = new UrlMaker('/thread').add('p', 10).gen()
    expect(url).toBe('/thread?p=10')
  })
  it('works with query params', () => {
    const url = new UrlMaker('/thread').add('p', 10).add('ps', 16).gen()
    expect(url).toBe('/thread?p=10&ps=16')
  })
  it('works with default param value', () => {
    const url = new UrlMaker('/thread').add('p', 0, 0).add('ps', 16, 32).gen()
    expect(url).toBe('/thread?ps=16')
  })
})

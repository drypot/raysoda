import { UrlMaker } from './url.mjs'

describe('UrlMaker', () => {
  it('url should succeed', () => {
    const url = new UrlMaker('/thread').gen()
    expect(url).toBe('/thread')
  })
  it('query param should succeed', () => {
    const url = new UrlMaker('/thread').add('p', 10).gen()
    expect(url).toBe('/thread?p=10')
  })
  it('query params should succeed', () => {
    const url = new UrlMaker('/thread').add('p', 10).add('ps', 16).gen()
    expect(url).toBe('/thread?p=10&ps=16')
  })
  it('default value should succeed', () => {
    const url = new UrlMaker('/thread').add('p', 0, 0).add('ps', 16, 32).gen()
    expect(url).toBe('/thread?ps=16')
  })
})

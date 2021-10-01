import { UrlMaker } from './url2.js'

describe('UrlMaker', () => {
  it('only url', () => {
    const url = UrlMaker.from('/thread').toString()
    expect(url).toBe('/thread')
  })
  it('with query param', () => {
    const url = UrlMaker.from('/thread').add('p', 10).toString()
    expect(url).toBe('/thread?p=10')
  })
  it('with query params', () => {
    const url = UrlMaker.from('/thread').add('p', 10).add('ps', 16).toString()
    expect(url).toBe('/thread?p=10&ps=16')
  })
  it('with default value', () => {
    const url = UrlMaker.from('/thread').add('p', 0, 0).add('ps', 16, 32).toString()
    expect(url).toBe('/thread?ps=16')
  })
})

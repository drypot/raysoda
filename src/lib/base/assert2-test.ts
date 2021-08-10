import { throws } from 'assert'
import { assertEmpty, assertNotEmpty, assertPathExists, assertPathNotExists, assertResourceMoved } from './assert2.js'

describe('assertEmpty', () => {
  it('should work', () => {
    assertEmpty(undefined)
    assertEmpty(null)
    assertEmpty({})
    throws(function () {
      assertEmpty({ a: 1 })
    })
  })
})

describe('assertNotEmpty', () => {
  it('should work', () => {
    assertNotEmpty({ a: 1 })
    throws(function () {
      assertNotEmpty({})
    })
  })
})

describe('assertPathExists', () => {
  it('should work', () => {
    assertPathExists('src/lib/base/fixture/test-dummy.txt')
    assertPathNotExists('src/lib/base/fixture/not-exist.txt')
  })
})

describe('assertResourceMoved', () => {
  it('should work', () => {
    assertResourceMoved({
      status: 301,
      header: {
        location: '/new301'
      }
    }, '/new301')
    assertResourceMoved({
      status: 302,
      header: {
        location: '/new302'
      }
    }, '/new302')
  })
})

import { throws } from 'assert'
import { assertEmpty, assertNotEmpty, assertPathExists, assertPathNotExists, assertResourceMoved } from './assert2.js'

describe('assertEmpty', () => {
  it('should work', done => {
    assertEmpty(undefined)
    assertEmpty(null)
    assertEmpty({})
    throws(function () {
      assertEmpty({ a: 1 })
    })
    done()
  })
})

describe('assertNotEmpty', () => {
  it('should work', done => {
    assertNotEmpty({ a: 1 })
    throws(function () {
      assertNotEmpty({})
    })
    done()
  })
})

describe('assertPathExists', () => {
  it('should work', done => {
    assertPathExists('src/supp/base/assert2-test-fixture.txt')
    assertPathNotExists('src/supp/base/assert2-test-fixture-xxx.txt')
    done()
  })
})

describe('assertResourceMoved', () => {
  it('should work', done => {
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
    done()
  })
})

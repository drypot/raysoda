import { throws } from 'assert'
import { empty, notEmpty, pathExists, pathNotExists, resourceMoved } from './assert.js'

describe('empty', () => {
  it('should succeed', done => {
    empty(undefined)
    empty(null)
    empty({})
    throws(function () {
      empty({ a: 1 })
    })
    done()
  })
})

describe('notEmpty', () => {
  it('should succeed', done => {
    notEmpty({ a: 1 })
    throws(function () {
      notEmpty({})
    })
    done()
  })
})

describe('pathExists', () => {
  it('should succeed', done => {
    pathExists('src/base/assert-test-fixture.txt')
    pathNotExists('src/base/assert-test-fixture-xxx.txt')
    done()
  })
})

describe('resourceMoved', () => {
  it('should succeed', done => {
    resourceMoved({
      status: 301,
      header: {
        location: '/new301'
      }
    }, '/new301')
    resourceMoved({
      status: 302,
      header: {
        location: '/new302'
      }
    }, '/new302')
    done()
  })
})

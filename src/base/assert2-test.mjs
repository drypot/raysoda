import { throws } from 'assert'
import { empty, notEmpty, pathExists, pathNotExists, resourceMoved } from './assert2.mjs'

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
    pathExists('src/base/assert2.mjs')
    pathNotExists('src/base/assertX.mjs')
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

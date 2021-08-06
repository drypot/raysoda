import { Express2 } from '../../lib/express/express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'
import { loadConfig } from '../config/config.js'

describe('about pages', () => {

  let server: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(done => {
    const config = loadConfig('config/raysoda-test.json')
    server = new Express2(config)
    router = server.router
    request = server.spawnRequest()
    server.start(done)
  })

  afterAll(done => {
    server.close(done)
  })

  describe('get /about/site', () => {
    it('should work', done => {
      request.get('/about/site').end(function (err, res) {
        expect(err).toBeFalsy()
        done()
      })
    })
  })
  describe('get /about/company', () => {
    it('should work', done => {
      request.get('/about/company').end(function (err, res) {
        expect(err).toBeFalsy()
        done()
      })
    })
  })
  describe('get /about/ad', () => {
    it('should work', done => {
      request.get('/about/ad').end(function (err, res) {
        expect(err).toBeFalsy()
        done()
      })
    })
  })
  describe('get /about/privacy', () => {
    it('should work', done => {
      request.get('/about/privacy').end(function (err, res) {
        expect(err).toBeFalsy()
        done()
      })
    })
  })
  describe('get /about/help', () => {
    it('should work', done => {
      request.get('/about/help').end(function (err, res) {
        expect(err).toBeFalsy()
        done()
      })
    })
  })

})

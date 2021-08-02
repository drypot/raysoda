import { loadConfig } from '../config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

let server: Express2
let router: Router
let request: SuperAgentTest

describe('Express2', () => {

  beforeAll(done => {
    const config = loadConfig('config/test.json')
    Express2.startTest(config, (err, _server, _router, _request) => {
      server = _server
      router = _router
      request = _request
      done()
    })
  })

  afterAll(done => {
    server.close(done)
  })

  it('can return hello object', done => {
    request.get('/api/hello').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.type).toBe('application/json')
      expect(res.body.message).toBe('hello')
      done()
    })
  })
  it('can return string', done => {
    router.get('/api/test/string', function (req, res, done) {
      res.json('hi')
    })
    request.get('/api/test/string').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.type).toBe('application/json')
      expect(res.body).toBe('hi')
      done()
    })
  })
  it('can return null', done => {
    router.get('/api/test/null', function (req, res, done) {
      res.json(null)
    })
    request.get('/api/test/null').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.type).toBe('application/json')
      expect(res.body).toBeNull()
      done()
    })
  })

})

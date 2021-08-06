import { loadConfig } from '../../app/config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

describe('Express2', () => {

  let server: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(done => {
    const config = loadConfig('config/app-test.json')
    server = new Express2(config)
    router = server.router
    request = server.spawnRequest()
    server.start(done)
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

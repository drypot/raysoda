import { loadConfig } from '../../app/config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'
import { INVALID_DATA } from '../base/error2.js'

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

  it('can return 404, Not Found', done => {
    request.get('/api/test/undefined-url').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.status).toBe(404)
      done()
    })
  })
  it('can return 404, Not Found', done => {
    router.get('/api/test/no-action', function (req, res, done) {
      done()
    })
    request.get('/api/test/no-action').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.status).toBe(404)
      done()
    })
  })
  it('can return INVALID_DATA', done => {
    router.get('/api/test/invalid-data', function (req, res, done) {
      done(INVALID_DATA)
    })
    request.get('/api/test/invalid-data').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.type).toBe('application/json')
      expect(res.body.errType).toBe('form')
      expect(res.body.err).toEqual(INVALID_DATA)
      done()
    })
  })
  it('can return [INVALID_DATA]', done => {
    router.get('/api/test/invalid-data-array', function (req, res, done) {
      done([INVALID_DATA])
    })
    request.get('/api/test/invalid-data-array').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.type).toBe('application/json')
      expect(res.body.errType).toBe('array')
      expect(res.body.err).toEqual([INVALID_DATA])
      done()
    })
  })
  it('can return system error', done => {
    router.get('/api/test/system-error', function (req, res, done) {
      done(new Error('System Error'))
    })
    request.get('/api/test/system-error').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.type).toBe('application/json')
      expect(res.body.errType).toBe('system')
      expect(res.body.err.name).toBe('Error')
      expect(res.body.err.message).toBe('System Error')
      done()
    })
  })
})

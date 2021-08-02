import { loadConfig } from '../config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'
import { INVALID_DATA, lookupErrors } from '../base/error2.js'

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

  it('can return 404, Not Found', done => {
    request.get('/api/test/undefined-url').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.status).toBe(404)
      done()
    })
  })
  it('can return 404, Not Found', done => {
    server.router.get('/api/test/no-action', function (req, res, done) {
      done()
    })
    request.get('/api/test/no-action').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.status).toBe(404)
      done()
    })
  })
  it('can return INVALID_DATA', done => {
    server.router.get('/api/test/invalid-data', function (req, res, done) {
      done(INVALID_DATA)
    })
    request.get('/api/test/invalid-data').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.type).toBe('application/json')
      expect(res.body.errType).toBe('form')
      expect(res.body.err.code).toBe(INVALID_DATA.code)
      expect(lookupErrors(res.body.err, INVALID_DATA)).toBe(true)
      done()
    })
  })
  it('can return INVALID_DATA error page', done => {
    server.router.get('/test/invalid-data-page', function (req, res, done) {
      done(INVALID_DATA)
    })
    request.get('/test/invalid-data-page').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.type).toBe('text/html')
      expect(res.text).toMatch('INVALID_DATA')
      done()
    })
  })
  it('can return system error', done => {
    server.router.get('/api/test/system-error', function (req, res, done) {
      done(new Error('SYSTEM_ERROR'))
    })
    request.get('/api/test/system-error').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.type).toBe('application/json')
      expect(res.body.errType).toBe('system')
      //expect(res.body.err.message).toBe('SYSTEM_ERROR')
      done()
    })
  })
  it('can return system error page', done => {
    server.router.get('/test/system-error-page', function (req, res, done) {
      done(new Error('SYSTEM_ERROR'))
    })
    request.get('/test/system-error-page').end(function (err, res) {
      expect(err).toBeFalsy()
      expect(res.type).toBe('text/html')
      expect(res.text).toMatch('SYSTEM_ERROR')
      done()
    })
  })
})

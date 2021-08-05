import { loadConfig } from '../../app/config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

describe('Express2', () => {

  let server: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(done => {
    const config = loadConfig('config/test.json')
    server = new Express2(config)
    router = server.router
    request = server.spawnRequest()
    server.start(done)
  })

  afterAll(done => {
    server.close(done)
  })

  describe('/api/echo', () => {
    describe('get', () => {
      it('should work', done => {
        request.get('/api/echo?p1&p2=123').end(function (err, res) {
          expect(err).toBeFalsy()
          expect(res.body.method).toBe('GET')
          expect(res.body.query).toEqual({ p1: '', p2: '123' })
          done()
        })
      })
    })
    describe('post', () => {
      it('should work', done => {
        request.post('/api/echo').send({ p1: '', p2: '123' }).end(function (err, res) {
          expect(err).toBeFalsy()
          expect(res.body.method).toBe('POST')
          expect(res.body.body).toEqual({ p1: '', p2: '123' })
          done()
        })
      })
    })
    describe('delete', () => {
      it('should work', done => {
        request.del('/api/echo').end(function (err, res) {
          expect(err).toBeFalsy()
          expect(res.body.method).toBe('DELETE')
          done()
        })
      })
    })
  })

})

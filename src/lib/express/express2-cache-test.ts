import { loadConfig } from '../../app/config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

let server: Express2
let router: Router
let request: SuperAgentTest

describe('Express2', () => {

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

  describe('api request', () => {
    it('should return Cache-Control: no-cache', done => {
      request.get('/api/hello').end((err, res) => {
        expect(err).toBeFalsy()
        expect(res.get('Cache-Control')).toBe('no-cache')
        done()
      })
    })
  })

  describe('none api request', () => {
    it('should return Cache-Control: private', done => {
      router.get('/test/cache-test', (req, res, done) => {
        res.send('<p>must be cached</p>')
      })
      request.get('/test/cache-test').end((err, res) => {
        expect(err).toBeFalsy()
        expect(res.get('Cache-Control')).toBe('private')
        done()
      })
    })
  })

})

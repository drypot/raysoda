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

  it('can return html', done => {
    router.get('/test/html', (req, res, done) => {
      res.send('<p>some text</p>')
    })
    request.get('/test/html').end((err, res) => {
      expect(err).toBeFalsy()
      expect(res.type).toBe('text/html')
      expect(res.text).toBe('<p>some text</p>')
      done()
    })
  })

})

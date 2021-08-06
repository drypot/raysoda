import { loadConfig } from '../../app/config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

declare module 'express-session' {
  interface SessionData {
    [key: string]: string
  }
}

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

  describe('session', () => {
    beforeAll(() => {
      router.put('/api/test/session', (req, res) => {
        let body: { [key: string]: string } = req.body
        for (let [k, v] of Object.entries(body)) {
          req.session[k] = v
        }
        res.json({})
      })
      router.get('/api/test/session', (req, res) => {
        const body: string[] = req.body
        const obj: { [key: string]: string | undefined } = {}
        for (let k of body) {
          obj[k] = req.session[k]
        }
        res.json(obj)
      })
    })
    it('should return session vars', done => {
      request.put('/api/test/session').send({ book: 'book1', price: 11 }).end((err, res) => {
        expect(err).toBeFalsy()
        expect(res.body.err).toBeFalsy()
        request.get('/api/test/session').send(['book', 'price']).end((err, res) => {
          expect(err).toBeFalsy()
          expect(res.body.book).toBe('book1')
          expect(res.body.price).toBe(11)
          done()
        })
      })
    })
    it('should return empty after session destroyed', done => {
      request.put('/api/test/session').send({ book: 'book1', price: 11 }).end((err, res) => {
        expect(err).toBeFalsy()
        expect(res.body.err).toBeFalsy()
        request.post('/api/destroy-session').end((err, res) => {
          expect(err).toBeFalsy()
          expect(res.body.err).toBeFalsy()
          request.get('/api/test/session').send(['book', 'price']).end((err, res) => {
            expect(err).toBeFalsy()
            expect(res.body.book).toBeUndefined()
            expect(res.body.price).toBeUndefined()
            done()
          })
        })
      })
    })
  })

})

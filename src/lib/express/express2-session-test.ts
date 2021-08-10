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

  beforeAll(async () => {
    const config = loadConfig('config/app-test.json')
    server = new Express2(config)
    router = server.router
    request = server.spawnRequest()
    await server.start()
  })

  afterAll(async () => {
    await server.close()
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
        const keys: string[] = req.body
        const obj: { [key: string]: string | undefined } = {}
        for (let k of keys) {
          obj[k] = req.session[k]
        }
        res.json(obj)
      })
    })
    it('can store/return session vars', async () => {
      let res: any

      res = await request.put('/api/test/session').send({ book: 'book1', price: 11 })
      expect(res.body.err).toBeFalsy()

      res = await request.get('/api/test/session').send(['book', 'price'])
      expect(res.body.book).toBe('book1')
      expect(res.body.price).toBe(11)
    })
    it('should be empty after destroyed', async () => {
      let res: any

      res = await request.put('/api/test/session').send({ book: 'book1', price: 11 })
      expect(res.body.err).toBeFalsy()

      res = await request.post('/api/destroy-session')
      expect(res.body.err).toBeFalsy()

      res = await request.get('/api/test/session').send(['book', 'price'])
      expect(res.body.book).toBeUndefined()
      expect(res.body.price).toBeUndefined()
    })
  })

})

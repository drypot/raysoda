import { configFrom } from '../../config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

declare module 'express-session' {
  interface SessionData {
    [key: string]: string
  }
}

describe('Express2', () => {

  let web: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = configFrom('config/app-test.json')
    web = await Express2.from(config).start()
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
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

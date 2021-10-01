import { readConfigSync } from '../../_util/config-loader.js'
import { Express2 } from './express2.js'
import { SuperAgentTest } from 'supertest'

describe('Express2', () => {

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = readConfigSync('config/app-test.json')
    web = await Express2.from(config).start()
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  describe('session', () => {
    beforeAll(() => {
      web.router.put('/api/test/session', (req, res) => {
        let body: { [key: string]: string } = req.body
        for (let [k, v] of Object.entries(body)) {
          (req.session as any)[k] = v
        }
        res.json({})
      })
      web.router.get('/api/test/session', (req, res) => {
        const keys: string[] = req.body
        const obj: { [key: string]: string | undefined } = {}
        for (let k of keys) {
          obj[k] = (req.session as any)[k]
        }
        res.json(obj)
      })
    })
    it('can store/return session vars', async () => {
      let res: any

      res = await request.put('/api/test/session').send({ book: 'book1', price: 11 }).expect(200)
      expect(res.body.err).toBeFalsy()

      res = await request.get('/api/test/session').send(['book', 'price']).expect(200)
      expect(res.body.book).toBe('book1')
      expect(res.body.price).toBe(11)
    })
    it('should be empty after destroyed', async () => {
      let res: any

      res = await request.put('/api/test/session').send({ book: 'book1', price: 11 }).expect(200)
      expect(res.body.err).toBeFalsy()

      res = await request.post('/api/session-destroy')
      expect(res.body.err).toBeFalsy()

      res = await request.get('/api/test/session').send(['book', 'price']).expect(200)
      expect(res.body.book).toBeUndefined()
      expect(res.body.price).toBeUndefined()
    })
  })

})

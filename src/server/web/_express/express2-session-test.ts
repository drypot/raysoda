import { loadConfigSync } from '../../_util/config-loader'
import { Express2 } from './express2'
import supertest, { SuperAgentTest } from 'supertest'

describe('Express2 Session', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfigSync('config/app-test.json')
    web = Express2.from(config)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
  })

  it('setup', () => {
    web.router.post('/api/session-destroy', function (req, res, done) {
      req.session.destroy(() => {
        res.json({})
      })
    })
    web.router.put('/api/put', (req, res) => {
      for (let [k, v] of Object.entries(req.body)) {
        req.session[k] = v
      }
      res.json({})
    })
    web.router.get('/api/get', (req, res) => {
      const obj: any = {}
      for (const k of req.body) {
        obj[k] = req.session[k]
      }
      res.json(obj)
    })
  })
  it('put/get', async () => {
    await sat.put('/api/put').send({ book: 'book1', price: 11 }).expect(200)
    const res = await sat.get('/api/get').send(['book', 'price']).expect(200)
    expect(res.body).toEqual({ book: 'book1', price: 11 })
  })
  it('empty after destroyed', async () => {
    await sat.put('/api/put').send({ book: 'book1', price: 11 }).expect(200)
    await sat.post('/api/session-destroy')
    const res = await sat.get('/api/get').send(['book', 'price']).expect(200)
    expect(res.body).toEqual({})
  })

})
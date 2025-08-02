import { Express2, getExpress2 } from './express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../oman/oman.js'

describe('Express2 Session', () => {

  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    express2 = await getExpress2()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('setup', () => {
    express2.router.post('/api/session-destroy', function (req, res, done) {
      req.session.destroy(() => {
        res.json({})
      })
    })
    express2.router.put('/api/put', (req, res) => {
      for (let [k, v] of Object.entries(req.body)) {
        req.session[k] = v
      }
      res.json({})
    })
    express2.router.get('/api/get', (req, res) => {
      const obj: any = {}
      for (const k of req.body) {
        obj[k] = req.session[k]
      }
      res.json(obj)
    })
  })
  it('put/get', async () => {
    await agent.put('/api/put').send({ book: 'book1', price: 11 }).expect(200)
    const res = await agent.get('/api/get').send(['book', 'price']).expect(200)
    expect(res.body).toEqual({ book: 'book1', price: 11 })
  })
  it('empty after destroyed', async () => {
    await agent.put('/api/put').send({ book: 'book1', price: 11 }).expect(200)
    await agent.post('/api/session-destroy')
    const res = await agent.get('/api/get').send(['book', 'price']).expect(200)
    expect(res.body).toEqual({})
  })

})

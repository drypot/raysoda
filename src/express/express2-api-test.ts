import supertest from "supertest"
import { initObjectContext, closeAllObjects } from "../oman/oman.ts"
import { type Express2, getExpress2 } from "./express2.ts"

describe('Express2 res.locals.api', () => {

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

  let count = 0

  it('setup /api/test', () => {
    express2.router.get('/api/test', (req, res) => {
      expect(res.locals.api).toBe(true)
      count = 10
      res.json({})
    })
  })
  it('api', async () => {
    const res = await agent.get('/api/test').expect(200)
    expect(count).toBe(10)
  })
  it('setup /test', () => {
    express2.router.get('/test', (req, res) => {
      expect(res.locals.api).toBe(false)
      count = 20
      res.json({})
    })
  })
  it('page', async () => {
    const res = await agent.get('/test').expect(200)
    expect(count).toBe(20)
  })

})

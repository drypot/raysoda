import { Express2, getExpress2 } from './express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../oman/oman.js'

describe('Express2 Json', () => {

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
    express2.router.get('/api/object', function (req, res, done) {
      res.json({ message: 'hello' })
    })
  })
  it('object', async () => {
    const res = await agent.get('/api/object').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toEqual({ message: 'hello' })
  })
  it('setup', () => {
    express2.router.get('/api/string', function (req, res, done) {
      res.json('hi')
    })
  })
  it('string', async () => {
    const res = await agent.get('/api/string').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBe('hi')
  })
  it('setup', () => {
    express2.router.get('/api/null', function (req, res, done) {
      res.json(null)
    })
  })
  it('null', async () => {
    const res = await agent.get('/api/null').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeNull()
  })

})

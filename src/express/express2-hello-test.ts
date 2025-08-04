import { Express2, getExpress2 } from './express2.ts'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../oman/oman.ts'

describe('Express2 Hello', () => {

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

  it('hello', async () => {
    const res = await agent.get('/api/hello').expect(200)
    // expect(res.type).toBe('text/plain')
    // expect(res.text).toBe('hello')
    expect(res.type).toBe('application/json')
    expect(res.body).toBe('hello')
  })

})

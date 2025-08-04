import { Express2, getExpress2 } from './express2.ts'
import supertest from 'supertest'
import { INVALID_DATA } from '../common/type/error-const.ts'
import { closeAllObjects, initObjectContext } from '../oman/oman.ts'

describe('Express2 Error', () => {

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

  it('404 if api url not exist', async () => {
    await agent.get('/api/test/undefined-url').expect(404)
  })
  it('404 if not handled', async () => {
    await agent.get('/api/no-action').expect(404)
  })
  it('404 if page url not exist', async () => {
    await agent.get('/undefined-page').expect(404).expect(/<title>Error/)
  })
  it('api INVALID_DATA', async () => {
    const res = await agent.get('/api/invalid-data').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('api [INVALID_DATA]', async () => {
    const res = await agent.get('/api/invalid-data-array').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('api system error', async () => {
    const res = await agent.get('/api/system-error').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err[0].name).toBe('Error')
    expect(res.body.err[0].message).toMatch(/System Error/)
    expect(res.body.err[0].field).toBe('_system')
  })
  it('page system error', async () => {
    const res = await agent.get('/system-error').expect(200).expect(/<title>Error/)
    expect(res.type).toBe('text/html')
  })

})

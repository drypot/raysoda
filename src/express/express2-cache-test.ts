import { Express2, getExpress2 } from './express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../oman/oman.js'

describe('Express2 Cache', () => {

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

  it('setup /api/cache-test', () => {
    express2.router.get('/api/cache-test', function (req, res, done) {
      res.json({})
    })
  })
  it('for api, should return Cache-Control: no-cache', async () => {
    const res = await agent.get('/api/cache-test').expect(200)
    expect(res.get('Cache-Control')).toBe('no-cache')
  })
  it('setup /cache-test', () => {
    express2.router.get('/test/cache-test', (req, res) => {
      res.send('<p>must be cached</p>')
    })
  })
  it('for page, should return Cache-Control: private', async () => {
    const res = await agent.get('/test/cache-test').expect(200)
    expect(res.get('Cache-Control')).toBe('private')
  })

})

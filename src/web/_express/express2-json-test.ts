import { loadConfigSync } from '../../_util/config-loader.js'
import { Express2 } from './express2.js'
import { SuperAgentTest } from 'supertest'

describe('Express2 Json', () => {
  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfigSync('config/app-test.json')
    web = await Express2.from(config).start()
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  it('setup', () => {
    web.router.get('/api/object', function (req, res, done) {
      res.json({ message: 'hello' })
    })
  })
  it('object', async () => {
    const res = await request.get('/api/object').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toEqual({ message: 'hello' })
  })
  it('setup', () => {
    web.router.get('/api/string', function (req, res, done) {
      res.json('hi')
    })
  })
  it('string', async () => {
    const res = await request.get('/api/string').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBe('hi')
  })
  it('setup', () => {
    web.router.get('/api/null', function (req, res, done) {
      res.json(null)
    })
  })
  it('null', async () => {
    const res = await request.get('/api/null').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeNull()
  })
})

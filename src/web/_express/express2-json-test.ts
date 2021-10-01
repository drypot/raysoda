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

  it('can return hello object', async () => {
    const res = await request.get('/api/hello').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.message).toBe('hello')
  })
  it('can return string', async () => {
    web.router.get('/api/test/string', function (req, res, done) {
      res.json('hi')
    })
    const res = await request.get('/api/test/string').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBe('hi')
  })
  it('can return null', async () => {
    web.router.get('/api/test/null', function (req, res, done) {
      res.json(null)
    })
    const res = await request.get('/api/test/null').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeNull()
  })

})

import { configFrom } from '../../config/config.js'
import { Express2 } from './express2.js'
import { SuperAgentTest } from 'supertest'
import { INVALID_DATA } from '../../lib/base/error2.js'

describe('Express2', () => {

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = configFrom('config/app-test.json')
    web = await Express2.from(config).start()
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  it('can return 404, Not Found', async () => {
    const res = await request.get('/api/test/undefined-url')
    expect(res.status).toBe(404)
  })
  it('can return 404, Not Found', async () => {
    web.router.get('/api/test/no-action', function (req, res, done) {
      done()
    })
    const res = await request.get('/api/test/no-action')
    expect(res.status).toBe(404)
  })
  it('can return INVALID_DATA', async () => {
    web.router.get('/api/test/invalid-data', function (req, res, done) {
      done(INVALID_DATA)
    })
    const res = await request.get('/api/test/invalid-data')
    expect(res.type).toBe('application/json')
    expect(res.body.errType).toBe('form')
    expect(res.body.err).toEqual(INVALID_DATA)
  })
  it('can return [INVALID_DATA]', async () => {
    web.router.get('/api/test/invalid-data-array', function (req, res, done) {
      done([INVALID_DATA])
    })
    const res = await request.get('/api/test/invalid-data-array')
    expect(res.type).toBe('application/json')
    expect(res.body.errType).toBe('array')
    expect(res.body.err).toEqual([INVALID_DATA])
  })
  it('can return system error', async () => {
    web.router.get('/api/test/system-error', function (req, res, done) {
      done(new Error('System Error'))
    })
    const res = await request.get('/api/test/system-error')
    expect(res.type).toBe('application/json')
    expect(res.body.errType).toBe('system')
    expect(res.body.err.name).toBe('Error')
    expect(res.body.err.message).toBe('System Error')
  })

})

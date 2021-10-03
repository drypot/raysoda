import { loadConfigSync } from '../../_util/config-loader.js'
import { Express2 } from './express2.js'
import { SuperAgentTest } from 'supertest'
import { INVALID_DATA } from '../../_type/error.js'

describe('Express2 Error', () => {

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

  it('404 if url not exist', async () => {
    const res = await request.get('/api/test/undefined-url').expect(404)
  })
  it('setup', () => {
    web.router.get('/api/no-action', function (req, res, done) {
      done()
    })
  })
  it('404 if not handled', async () => {
    const res = await request.get('/api/no-action').expect(404)
  })
  it('setup', () => {
    web.router.get('/api/invalid-data', function (req, res, done) {
      done(INVALID_DATA)
    })
  })
  it('INVALID_DATA', async () => {
    const res = await request.get('/api/invalid-data').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('setup', () => {
    web.router.get('/api/invalid-data-array', function (req, res, done) {
      done([INVALID_DATA])
    })
  })
  it('[INVALID_DATA]', async () => {
    const res = await request.get('/api/invalid-data-array').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('setup', () => {
    web.router.get('/api/system-error', function (req, res, done) {
      done(new Error('System Error'))
    })
  })
  it('system error', async () => {
    const res = await request.get('/api/system-error').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err[0].name).toBe('Error')
    expect(res.body.err[0].message).toBe('System Error')
  })

})

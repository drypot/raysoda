import { loadConfig } from '../../app/config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'
import { INVALID_DATA } from '../base/error2.js'

describe('Express2', () => {

  let server: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfig('config/app-test.json')
    server = new Express2(config)
    router = server.router
    request = server.spawnRequest()
    await server.start()
  })

  afterAll(async () => {
    await server.close()
  })

  it('can return 404, Not Found', async () => {
    const res = await request.get('/api/test/undefined-url')
    expect(res.status).toBe(404)
  })
  it('can return 404, Not Found', async () => {
    router.get('/api/test/no-action', function (req, res, done) {
      done()
    })
    const res = await request.get('/api/test/no-action')
    expect(res.status).toBe(404)
  })
  it('can return INVALID_DATA', async () => {
    router.get('/api/test/invalid-data', function (req, res, done) {
      done(INVALID_DATA)
    })
    const res = await request.get('/api/test/invalid-data')
    expect(res.type).toBe('application/json')
    expect(res.body.errType).toBe('form')
    expect(res.body.err).toEqual(INVALID_DATA)
  })
  it('can return [INVALID_DATA]', async () => {
    router.get('/api/test/invalid-data-array', function (req, res, done) {
      done([INVALID_DATA])
    })
    const res = await request.get('/api/test/invalid-data-array')
    expect(res.type).toBe('application/json')
    expect(res.body.errType).toBe('array')
    expect(res.body.err).toEqual([INVALID_DATA])
  })
  it('can return system error', async () => {
    router.get('/api/test/system-error', function (req, res, done) {
      done(new Error('System Error'))
    })
    const res = await request.get('/api/test/system-error')
    expect(res.type).toBe('application/json')
    expect(res.body.errType).toBe('system')
    expect(res.body.err.name).toBe('Error')
    expect(res.body.err.message).toBe('System Error')
  })

})

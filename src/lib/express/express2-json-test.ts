import { loadConfig } from '../../app/config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

describe('Express2', () => {

  let web: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfig('config/app-test.json')
    web = new Express2(config)
    router = web.router
    request = web.spawnRequest()
    await web.start()
  })

  afterAll(async () => {
    await web.close()
  })

  it('can return hello object', async () => {
    const res = await request.get('/api/hello')
    expect(res.type).toBe('application/json')
    expect(res.body.message).toBe('hello')
  })
  it('can return string', async () => {
    router.get('/api/test/string', function (req, res, done) {
      res.json('hi')
    })
    const res = await request.get('/api/test/string')
    expect(res.type).toBe('application/json')
    expect(res.body).toBe('hi')
  })
  it('can return null', async () => {
    router.get('/api/test/null', function (req, res, done) {
      res.json(null)
    })
    const res = await request.get('/api/test/null')
    expect(res.type).toBe('application/json')
    expect(res.body).toBeNull()
  })

})

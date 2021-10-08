import { loadConfigSync } from '../../_util/config-loader.js'
import { Express2, renderJson } from './express2.js'
import supertest, { SuperAgentTest } from 'supertest'

describe('Express2 Json', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfigSync('config/app-test.json')
    web = Express2.from(config)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
  })

  it('setup', () => {
    web.router.get('/api/object', function (req, res, done) {
      renderJson(res, { message: 'hello' })
    })
  })
  it('object', async () => {
    const res = await sat.get('/api/object').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toEqual({ message: 'hello' })
  })
  it('setup', () => {
    web.router.get('/api/string', function (req, res, done) {
      renderJson(res, 'hi')
    })
  })
  it('string', async () => {
    const res = await sat.get('/api/string').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBe('hi')
  })
  it('setup', () => {
    web.router.get('/api/null', function (req, res, done) {
      renderJson(res, null)
    })
  })
  it('null', async () => {
    const res = await sat.get('/api/null').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeNull()
  })

})

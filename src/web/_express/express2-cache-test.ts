import { loadConfigSync } from '../../_util/config-loader.js'
import { Express2, renderJson } from './express2.js'
import supertest, { SuperAgentTest } from 'supertest'

describe('Express2 Cache', () => {

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

  it('setup /api/cache-test', () => {
    web.router.get('/api/cache-test', function (req, res, done) {
      renderJson(res, {})
    })
  })
  it('for api, should return Cache-Control: no-cache', async () => {
    const res = await sat.get('/api/cache-test').expect(200)
    expect(res.get('Cache-Control')).toBe('no-cache')
  })
  it('setup /cache-test', () => {
    web.router.get('/test/cache-test', (req, res) => {
      res.send('<p>must be cached</p>')
    })
  })
  it('for page, should return Cache-Control: private', async () => {
    const res = await sat.get('/test/cache-test').expect(200)
    expect(res.get('Cache-Control')).toBe('private')
  })

})

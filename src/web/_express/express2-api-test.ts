import { loadConfigSync } from '../../_util/config-loader.js'
import { Express2 } from './express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { renderJson } from '../api/_api/api.js'

describe('Express2 res.locals.api', () => {

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

  let count = 0

  it('setup /api/test', () => {
    web.router.get('/api/test', (req, res) => {
      expect(res.locals.api).toBe(true)
      count = 10
      renderJson(res, {})
    })
  })
  it('api', async () => {
    const res = await sat.get('/api/test').expect(200)
    expect(count).toBe(10)
  })
  it('setup /test', () => {
    web.router.get('/test', (req, res) => {
      expect(res.locals.api).toBe(false)
      count = 20
      renderJson(res, {})
    })
  })
  it('page', async () => {
    const res = await sat.get('/test').expect(200)
    expect(count).toBe(20)
  })

})

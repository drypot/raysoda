import { configFrom } from '../../config/config.js'
import { Express2 } from './express2.js'
import { SuperAgentTest } from 'supertest'

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

  beforeAll(() => {
    web.router.get('/api/test-api', (req, res) => {
      expect(res.locals.api).toBe(true)
      res.json({})
    })
    web.router.get('/test-page', (req, res) => {
      expect(res.locals.api).toBe(false)
      res.json({})
    })
  })

  describe('res.local.api test', () => {
    it('should work for api', async () => {
      const res = await request.get('/api/test-api')
      expect(res.body).toEqual({})
    })
    it('should work for page', async () => {
      const res = await request.get('/test-page')
      expect(res.body).toEqual({})
    })
  })

})

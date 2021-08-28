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

  describe('api request', () => {
    it('should return Cache-Control: no-cache', async () => {
      const res = await request.get('/api/hello').expect(200)
      expect(res.get('Cache-Control')).toBe('no-cache')
    })
  })

  describe('none api request', () => {
    it('should return Cache-Control: private', async () => {
      web.router.get('/test/cache-test', (req, res) => {
        res.send('<p>must be cached</p>')
      })
      const res = await request.get('/test/cache-test').expect(200)
      expect(res.get('Cache-Control')).toBe('private')
    })
  })

})

import { configFrom } from '../../_util/config-loader.js'
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

  describe('/api/echo', () => {
    it('should work with get', async () => {
      const res = await request.get('/api/echo?p1&p2=123').expect(200)
      expect(res.body.method).toBe('GET')
      expect(res.body.query).toEqual({ p1: '', p2: '123' })
    })
    it('should work with post', async () => {
      const res = await request.post('/api/echo').send({ p1: '', p2: '123' }).expect(200)
      expect(res.body.method).toBe('POST')
      expect(res.body.body).toEqual({ p1: '', p2: '123' })
    })
    it('should work with delete', async () => {
      const res = await request.del('/api/echo').expect(200)
      expect(res.body.method).toBe('DELETE')
    })
  })

})

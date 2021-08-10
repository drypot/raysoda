import { loadConfig } from '../../app/config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

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

  describe('/api/echo', () => {
    it('should work with get', async () => {
      const res = await request.get('/api/echo?p1&p2=123')
      expect(res.body.method).toBe('GET')
      expect(res.body.query).toEqual({ p1: '', p2: '123' })
    })
    it('should work with post', async () => {
      const res = await request.post('/api/echo').send({ p1: '', p2: '123' })
      expect(res.body.method).toBe('POST')
      expect(res.body.body).toEqual({ p1: '', p2: '123' })
    })
    it('should work with delete', async () => {
      const res = await request.del('/api/echo')
      expect(res.body.method).toBe('DELETE')
    })
  })

})

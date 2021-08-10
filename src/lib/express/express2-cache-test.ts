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

  describe('api request', () => {
    it('should return Cache-Control: no-cache', async () => {
      const res = await request.get('/api/hello')
      expect(res.get('Cache-Control')).toBe('no-cache')
    })
  })

  describe('none api request', () => {
    it('should return Cache-Control: private', async () => {
      router.get('/test/cache-test', (req, res) => {
        res.send('<p>must be cached</p>')
      })
      const res = await request.get('/test/cache-test')
      expect(res.get('Cache-Control')).toBe('private')
    })
  })

})

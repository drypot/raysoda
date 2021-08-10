import { loadConfig } from '../../app/config/config.js'
import { Express2, toCallback } from './express2.js'
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

  async function service() {
    return Promise.resolve(10)
  }

  async function serviceWithError() {
    throw new Error('fatal error')
  }

  describe('async handler', () => {
    it('should work', async () => {
      router.get('/api/test/async', (req, res) => {
        service().then(v => {
          res.json(v)
        })
      })
      const res = await request.get('/api/test/async')
      expect(res.body).toBe(10)
    })
    it('should work 2', async () => {
      router.get('/api/test/async-err', (req, res, done) => {
        serviceWithError().then(v => {
          res.json(v)
        }).catch((err) => {
          done(err)
        })
      })
      const res = await request.get('/api/test/async-err')
      expect(res.body.err.message).toBe('fatal error')
    })
    it('should work 3', async () => {
      router.get('/api/test/async-err', toCallback(async (req, res) => {
        const v = await serviceWithError()
        res.json(v)
      }))
      const res = await request.get('/api/test/async-err')
      expect(res.body.err.message).toBe('fatal error')
    })
  })

})

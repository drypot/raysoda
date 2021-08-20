import { configFrom } from '../../config/config.js'
import { Express2, toCallback } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

describe('Express2', () => {

  let web: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = configFrom('config/app-test.json')
    web = await Express2.from(config).start()
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  describe('async handler', () => {
    it('setup promise ok handler', () => {
      router.get('/api/test/promise-ok', (req, res) => {
        Promise.resolve(10).then(v => {
          res.json(v)
        })
      })
    })
    it('should work', async () => {
      const res = await request.get('/api/test/promise-ok')
      expect(res.body).toBe(10)
    })
    it('setup promise err handler', () => {
      router.get('/api/test/promise-err', (req, res, done) => {
        Promise.reject(new Error('fatal error')).then(v => {
          res.json(v)
        }).catch(err => {
          done(err)
        })
      })
    })
    it('should work', async () => {
      const res = await request.get('/api/test/promise-err')
      expect(res.body.err.message).toBe('fatal error')
    })
    it('setup toCallback ok handler', () => {
      router.get('/api/test/tocallback-ok', toCallback(async (req, res) => {
        const v = await Promise.resolve(10)
        res.json(v)
      }))
    })
    it('should work', async () => {
      const res = await request.get('/api/test/tocallback-ok')
      expect(res.body).toBe(10)
    })
    it('setup toCallback err handler', () => {
      router.get('/api/test/tocallback-err', toCallback(async (req, res) => {
        const v = await Promise.reject(new Error('fatal error'))
        res.json(v)
      }))
    })
    it('should work', async () => {
      const res = await request.get('/api/test/tocallback-err')
      expect(res.body.err.message).toBe('fatal error')
    })
  })

})

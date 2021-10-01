import { readConfigSync } from '../../_util/config-loader.js'
import { Express2, toCallback } from './express2.js'
import { SuperAgentTest } from 'supertest'

describe('Express2', () => {

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = readConfigSync('config/app-test.json')
    web = await Express2.from(config).start()
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  describe('async handler', () => {
    it('setup promise ok handler', () => {
      web.router.get('/api/test/promise-ok', (req, res) => {
        Promise.resolve(10).then(v => {
          res.json(v)
        })
      })
    })
    it('should work', async () => {
      const res = await request.get('/api/test/promise-ok').expect(200)
      expect(res.body).toBe(10)
    })
    it('setup promise err handler', () => {
      web.router.get('/api/test/promise-err', (req, res, done) => {
        Promise.reject(new Error('fatal error')).then(v => {
          res.json(v)
        }).catch(err => {
          done(err)
        })
      })
    })
    it('should work', async () => {
      const res = await request.get('/api/test/promise-err').expect(200)
      expect(res.body.err[0].message).toBe('fatal error')
    })
    it('setup toCallback ok handler', () => {
      web.router.get('/api/test/tocallback-ok', toCallback(async (req, res) => {
        const v = await Promise.resolve(10)
        res.json(v)
      }))
    })
    it('should work', async () => {
      const res = await request.get('/api/test/tocallback-ok').expect(200)
      expect(res.body).toBe(10)
    })
    it('setup toCallback err handler', () => {
      web.router.get('/api/test/tocallback-err', toCallback(async (req, res) => {
        const v = await Promise.reject(new Error('fatal error'))
        res.json(v)
      }))
    })
    it('should work', async () => {
      const res = await request.get('/api/test/tocallback-err').expect(200)
      expect(res.body.err[0].message).toBe('fatal error')
    })
  })

})

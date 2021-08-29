import { configFrom } from '../../config/config.js'
import { Express2 } from './express2.js'
import { SuperAgentTest } from 'supertest'
import { INVALID_DATA } from '../../lib/base/error2.js'

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

  describe('error conditions', () => {
    it('404 if url not exist', async () => {
      const res = await request.get('/api/test/undefined-url').expect(404)
    })
    it('404 if not handled', async () => {
      web.router.get('/api/test/no-action', function (req, res, done) {
        done()
      })
      const res = await request.get('/api/test/no-action').expect(404)
    })
    it('INVALID_DATA', async () => {
      web.router.get('/api/test/invalid-data', function (req, res, done) {
        done(INVALID_DATA)
      })
      const res = await request.get('/api/test/invalid-data').expect(200)
      expect(res.type).toBe('application/json')
      expect(res.body.err.length).toBe(1)
      expect(res.body.err).toContain(INVALID_DATA)
    })
    it('[INVALID_DATA]', async () => {
      web.router.get('/api/test/invalid-data-array', function (req, res, done) {
        done([INVALID_DATA])
      })
      const res = await request.get('/api/test/invalid-data-array').expect(200)
      expect(res.type).toBe('application/json')
      expect(res.body.err.length).toBe(1)
      expect(res.body.err).toContain(INVALID_DATA)
    })
    it('system error', async () => {
      web.router.get('/api/test/system-error', function (req, res, done) {
        done(new Error('System Error'))
      })
      const res = await request.get('/api/test/system-error').expect(200)
      expect(res.type).toBe('application/json')
      expect(res.body.err.length).toBe(1)
      expect(res.body.err[0].name).toBe('Error')
      expect(res.body.err[0].message).toBe('System Error')
    })
  })

})

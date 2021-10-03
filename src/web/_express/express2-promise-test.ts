import { loadConfigSync } from '../../_util/config-loader.js'
import { Express2, toCallback } from './express2.js'
import { SuperAgentTest } from 'supertest'

describe('Express2 toCallback', () => {

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfigSync('config/app-test.json')
    web = await Express2.from(config).start()
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  it('setup promise handler', () => {
    web.router.get('/api/promise-ok', (req, res) => {
      Promise.resolve(10).then(v => {
        res.json(v)
      })
    })
  })
  it('promise handler', async () => {
    const res = await request.get('/api/promise-ok').expect(200)
    expect(res.body).toBe(10)
  })
  it('setup promise err handler', () => {
    web.router.get('/api/promise-err', (req, res, done) => {
      Promise.reject(new Error('fatal error')).then(v => {
        res.json(v)
      }).catch(err => {
        done(err)
      })
    })
  })
  it('promise err handler', async () => {
    const res = await request.get('/api/promise-err').expect(200)
    expect(res.body.err[0].message).toBe('fatal error')
  })
  it('setup toCallback handler', () => {
    web.router.get('/api/tocallback-ok', toCallback(async (req, res) => {
      const v = await Promise.resolve(10)
      res.json(v)
    }))
  })
  it('should work', async () => {
    const res = await request.get('/api/tocallback-ok').expect(200)
    expect(res.body).toBe(10)
  })
  it('setup toCallback err handler', () => {
    web.router.get('/api/tocallback-err', toCallback(async (req, res) => {
      const v = await Promise.reject(new Error('fatal error'))
      res.json(v)
    }))
  })
  it('toCallback err handler', async () => {
    const res = await request.get('/api/tocallback-err').expect(200)
    expect(res.body.err[0].message).toBe('fatal error')
  })

})

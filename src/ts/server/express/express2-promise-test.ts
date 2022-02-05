import { Express2, toCallback } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'

describe('Express2 toCallback', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    web = await getObject('Express2') as Express2
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('setup promise handler', () => {
    web.router.get('/api/promise-ok', (req, res) => {
      Promise.resolve(10).then(v => {
        res.json(v)
      })
    })
  })
  it('promise handler', async () => {
    const res = await sat.get('/api/promise-ok').expect(200)
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
    const res = await sat.get('/api/promise-err').expect(200)
    expect(res.body.err[0].message).toMatch(/fatal error/)
  })
  it('setup toCallback handler', () => {
    web.router.get('/api/tocallback-ok', toCallback(async (req, res) => {
      const v = await Promise.resolve(10)
      res.json(v)
    }))
  })
  it('should work', async () => {
    const res = await sat.get('/api/tocallback-ok').expect(200)
    expect(res.body).toBe(10)
  })
  it('setup toCallback err handler', () => {
    web.router.get('/api/tocallback-err', toCallback(async (req, res) => {
      const v = await Promise.reject(new Error('fatal error'))
      res.json(v)
    }))
  })
  it('toCallback err handler', async () => {
    const res = await sat.get('/api/tocallback-err').expect(200)
    expect(res.body.err[0].message).toMatch(/fatal error/)
  })

})

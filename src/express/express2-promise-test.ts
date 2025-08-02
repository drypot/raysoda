import { Express2, getExpress2, toCallback } from './express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../oman/oman.js'

describe('Express2 toCallback', () => {

  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    express2 = await getExpress2()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('setup promise handler', () => {
    express2.router.get('/api/promise-ok', (req, res) => {
      Promise.resolve(10).then(v => {
        res.json(v)
      })
    })
  })
  it('promise handler', async () => {
    const res = await agent.get('/api/promise-ok').expect(200)
    expect(res.body).toBe(10)
  })
  it('setup promise err handler', () => {
    express2.router.get('/api/promise-err', (req, res, done) => {
      Promise.reject(new Error('fatal error')).then(v => {
        res.json(v)
      }).catch(err => {
        done(err)
      })
    })
  })
  it('promise err handler', async () => {
    const res = await agent.get('/api/promise-err').expect(200)
    expect(res.body.err[0].message).toMatch(/fatal error/)
  })
  it('setup toCallback handler', () => {
    express2.router.get('/api/tocallback-ok', toCallback(async (req, res) => {
      const v = await Promise.resolve(10)
      res.json(v)
    }))
  })
  it('should work', async () => {
    const res = await agent.get('/api/tocallback-ok').expect(200)
    expect(res.body).toBe(10)
  })
  it('setup toCallback err handler', () => {
    express2.router.get('/api/tocallback-err', toCallback(async (req, res) => {
      const v = await Promise.reject(new Error('fatal error'))
      res.json(v)
    }))
  })
  it('toCallback err handler', async () => {
    const res = await agent.get('/api/tocallback-err').expect(200)
    expect(res.body.err[0].message).toMatch(/fatal error/)
  })

})

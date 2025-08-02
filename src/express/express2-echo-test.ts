import { Express2, getExpress2 } from './express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../oman/oman.js'

describe('Express2 Echo', () => {

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

  it('setup /api/echo', () => {
    express2.router.all('/api/echo', function (req, res, done) {
      res.json({
        method: req.method,
        rtype: req.header('content-type'),
        query: req.query,
        body: req.body
      })
    })
  })
  it('get', async () => {
    const res = await agent.get('/api/echo?p1&p2=123').expect(200)
    expect(res.body.method).toBe('GET')
    expect(res.body.query).toEqual({ p1: '', p2: '123' })
  })
  it('post', async () => {
    const res = await agent.post('/api/echo').send({ p1: '', p2: '123' }).expect(200)
    expect(res.body.method).toBe('POST')
    expect(res.body.body).toEqual({ p1: '', p2: '123' })
  })
  it('put', async () => {
    const res = await agent.put('/api/echo').send({ p1: '', p2: '123' }).expect(200)
    expect(res.body.method).toBe('PUT')
    expect(res.body.body).toEqual({ p1: '', p2: '123' })
  })
  it('delete', async () => {
    const res = await agent.del('/api/echo').expect(200)
    expect(res.body.method).toBe('DELETE')
  })

})

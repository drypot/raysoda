import { Express2 } from './express2.js'
import supertest from 'supertest'
import { closeAllObjects, getObject, initObjectContext } from '../oman/oman.js'

import './express2.js'

describe('Express2 Echo', () => {

  let web: Express2
  let sat: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    web = await getObject('Express2') as Express2
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('setup /api/echo', () => {
    web.router.all('/api/echo', function (req, res, done) {
      res.json({
        method: req.method,
        rtype: req.header('content-type'),
        query: req.query,
        body: req.body
      })
    })
  })
  it('get', async () => {
    const res = await sat.get('/api/echo?p1&p2=123').expect(200)
    expect(res.body.method).toBe('GET')
    expect(res.body.query).toEqual({ p1: '', p2: '123' })
  })
  it('post', async () => {
    const res = await sat.post('/api/echo').send({ p1: '', p2: '123' }).expect(200)
    expect(res.body.method).toBe('POST')
    expect(res.body.body).toEqual({ p1: '', p2: '123' })
  })
  it('delete', async () => {
    const res = await sat.del('/api/echo').expect(200)
    expect(res.body.method).toBe('DELETE')
  })

})

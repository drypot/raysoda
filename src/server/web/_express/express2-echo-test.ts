import { loadConfigSync } from '../../_util/config-loader'
import { Express2 } from './express2'
import supertest, { SuperAgentTest } from 'supertest'

describe('Express2 Echo', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfigSync('config/app-test.json')
    web = Express2.from(config)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
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
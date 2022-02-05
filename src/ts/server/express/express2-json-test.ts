import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'

describe('Express2 Json', () => {

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

  it('setup', () => {
    web.router.get('/api/object', function (req, res, done) {
      res.json({ message: 'hello' })
    })
  })
  it('object', async () => {
    const res = await sat.get('/api/object').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toEqual({ message: 'hello' })
  })
  it('setup', () => {
    web.router.get('/api/string', function (req, res, done) {
      res.json('hi')
    })
  })
  it('string', async () => {
    const res = await sat.get('/api/string').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBe('hi')
  })
  it('setup', () => {
    web.router.get('/api/null', function (req, res, done) {
      res.json(null)
    })
  })
  it('null', async () => {
    const res = await sat.get('/api/null').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeNull()
  })

})

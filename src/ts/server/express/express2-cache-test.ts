import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'

describe('Express2 Cache', () => {

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

  it('setup /api/cache-test', () => {
    web.router.get('/api/cache-test', function (req, res, done) {
      res.json({})
    })
  })
  it('for api, should return Cache-Control: no-cache', async () => {
    const res = await sat.get('/api/cache-test').expect(200)
    expect(res.get('Cache-Control')).toBe('no-cache')
  })
  it('setup /cache-test', () => {
    web.router.get('/test/cache-test', (req, res) => {
      res.send('<p>must be cached</p>')
    })
  })
  it('for page, should return Cache-Control: private', async () => {
    const res = await sat.get('/test/cache-test').expect(200)
    expect(res.get('Cache-Control')).toBe('private')
  })

})

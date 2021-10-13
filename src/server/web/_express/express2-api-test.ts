import { Express2 } from './express2'
import supertest, { SuperAgentTest } from 'supertest'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'

describe('Express2 res.locals.api', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    web = await omanGetObject('Express2') as Express2
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  let count = 0

  it('setup /api/test', () => {
    web.router.get('/api/test', (req, res) => {
      expect(res.locals.api).toBe(true)
      count = 10
      res.json({})
    })
  })
  it('api', async () => {
    const res = await sat.get('/api/test').expect(200)
    expect(count).toBe(10)
  })
  it('setup /test', () => {
    web.router.get('/test', (req, res) => {
      expect(res.locals.api).toBe(false)
      count = 20
      res.json({})
    })
  })
  it('page', async () => {
    const res = await sat.get('/test').expect(200)
    expect(count).toBe(20)
  })

})

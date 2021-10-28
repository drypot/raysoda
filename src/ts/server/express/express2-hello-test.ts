import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('Express2 Hello', () => {

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

  it('hello', async () => {
    const res = await sat.get('/api/hello').expect(200)
    expect(res.type).toBe('text/plain')
    expect(res.text).toBe('hello')
  })

})

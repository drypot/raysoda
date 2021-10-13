import { Express2 } from './express2'
import supertest, { SuperAgentTest } from 'supertest'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('Express2 Hello', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSessionForTest()
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

import { loadConfigSync } from '../../_util/config-loader.js'
import { Express2 } from './express2.js'
import supertest, { SuperAgentTest } from 'supertest'

describe('Express2 Hello', () => {

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

  it('hello', async () => {
    const res = await sat.get('/api/hello').expect(200)
    expect(res.type).toBe('text/plain')
    expect(res.text).toBe('hello')
  })

})

import { loadConfigSync } from '../../../_util/config-loader.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerLoginPage } from './login-page.js'
import { Config } from '../../../_type/config.js'

describe('LoginPage', () => {

  let config: Config

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    web = Express2.from(config)
    registerLoginPage(web)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
  })

  it('user-login should work', async () => {
    await sat.get('/login').expect(200).expect(/<title>Login/)
  })

})

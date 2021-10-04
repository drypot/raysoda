import { loadConfigSync } from '../../../_util/config-loader.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerPasswordPage } from './password-page.js'
import { Config } from '../../../_type/config.js'

describe('PasswordPage', () => {

  let config: Config

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    web = Express2.from(config)
    registerPasswordPage(web)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
  })

  it('user-password-reset', async () => {
    await sat.get('/password-reset').expect(200).expect(/<title>Password/)
  })
  it('user-password-reset-2', async () => {
    await sat.get('/password-reset-2').expect(200).expect(/<title>Password/)
  })
  it('/password-reset-3', async () => {
    await sat.get('/password-reset-3').expect(200).expect(/<title>Password/)
  })

})

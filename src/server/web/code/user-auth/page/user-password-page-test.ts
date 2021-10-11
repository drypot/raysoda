import { loadConfigSync } from '../../../../_util/config-loader.js'
import { Express2 } from '../../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserPasswordPage } from './user-password-page.js'
import { Config } from '../../../../_type/config.js'

describe('UserPasswordPage', () => {

  let config: Config

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    web = Express2.from(config)
    registerUserPasswordPage(web)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
  })

  it('1', async () => {
    await sat.get('/user-password-reset').expect(200).expect(/<title>Password/)
  })
  it('2', async () => {
    await sat.get('/user-password-reset-2').expect(200).expect(/<title>Password/)
  })
  it('3', async () => {
    await sat.get('/user-password-reset-3').expect(200).expect(/<title>Password/)
  })

})

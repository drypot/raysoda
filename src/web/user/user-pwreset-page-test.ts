import { Config, configFrom } from '../../_config/config.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserPwResetPage } from './user-pwreset-page.js'

describe('User Password Reset Page', () => {

  let config: Config

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    web = await Express2.from(config).start()
    registerUserPwResetPage(web)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  describe('password reset pages ', () => {
    it('user-password-reset', async () => {
      await request.get('/user-password-reset').expect(200).expect(/<title>Password/)
    })
    it('user-password-reset-2', async () => {
      await request.get('/user-password-reset-2').expect(200).expect(/<title>Password/)
    })
    it('/user-password-reset-3', async () => {
      await request.get('/user-password-reset-3').expect(200).expect(/<title>Password/)
    })
  })

})
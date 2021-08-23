import { Config, configFrom } from '../../../config/config.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerPwResetView } from './pwreset-view.js'

describe('Password Reset View', () => {

  let config: Config

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    web = await Express2.from(config).start()
    registerPwResetView(web)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  describe('password reset pages ', () => {
    it('/user/password-reset', async () => {
      await request.get('/user/password-reset').expect(200).expect(/<title>Password/)
    })
    it('/user/password-reset-2', async () => {
      await request.get('/user/password-reset-2').expect(200).expect(/<title>Password/)
    })
    it('/user/password-reset-3', async () => {
      await request.get('/user/password-reset-3').expect(200).expect(/<title>Password/)
    })
  })

})

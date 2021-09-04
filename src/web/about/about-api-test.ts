import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { configFrom } from '../../config/config.js'
import { registerAboutApi } from './about-api.js'

describe('About View', () => {

  let server: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = configFrom('config/raysoda-test.json')
    server = Express2.from(config)
    registerAboutApi(server)
    await server.start()
    request = server.spawnRequest()
  })

  afterAll(async () => {
    await server.close()
  })

  describe('about pages', () => {
    it('/about/site', async () => {
      await request.get('/about/site').expect(200).expect(/<title>About/)
    })
    it('/about/company', async () => {
      await request.get('/about/company').expect(200).expect(/<title>Company/)
    })
    it('/about/ad', async () => {
      await request.get('/about/ad').expect(200).expect(/<title>Advertise/)
    })
    it('/about/privacy', async () => {
      await request.get('/about/privacy').expect(200).expect(/<title>Privacy/)
    })
    it('/about/help', async () => {
      await request.get('/about/help').expect(200).expect(/<title>Help/)
    })
  })

})

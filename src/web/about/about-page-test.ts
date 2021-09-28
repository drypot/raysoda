import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { configFrom } from '../../_config/config.js'
import { registerAboutPage } from './about-page.js'

describe('About Page', () => {

  let server: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = configFrom('config/raysoda-test.json')
    server = Express2.from(config)
    registerAboutPage(server)
    await server.start()
    request = server.spawnRequest()
  })

  afterAll(async () => {
    await server.close()
  })

  describe('about pages', () => {
    it('/about', async () => {
      await request.get('/about').expect(200).expect(/<title>About/)
    })
    it('/company', async () => {
      await request.get('/company').expect(200).expect(/<title>Company/)
    })
    it('/ad', async () => {
      await request.get('/ad').expect(200).expect(/<title>Advertise/)
    })
    it('/privacy', async () => {
      await request.get('/privacy').expect(200).expect(/<title>Privacy/)
    })
    it('/help', async () => {
      await request.get('/help').expect(200).expect(/<title>Help/)
    })
  })

})

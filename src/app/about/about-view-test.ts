import { Express2 } from '../../lib/express/express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'
import { configFrom } from '../config/config.js'
import { initAboutView } from './about-view.js'

describe('About View', () => {

  let server: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = configFrom('config/raysoda-test.json')
    server = Express2.from(config)
    initAboutView(server)
    await server.start()
    router = server.router
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

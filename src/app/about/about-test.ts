import { Express2 } from '../../lib/express/express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'
import { configFrom } from '../config/config.js'
import { initAbout } from './about.js'

describe('about pages', () => {

  let server: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = configFrom('config/raysoda-test.json')
    server = Express2.from(config)
    initAbout(server)
    await server.start()
    router = server.router
    request = server.spawnRequest()
  })

  afterAll(async () => {
    await server.close()
  })

  describe('pages ', () => {
    it('/about/site should work', async () => {
      await request.get('/about/site').expect(200).expect(/<title>About/)
    })
    it('/about/company should work', async () => {
      await request.get('/about/company').expect(200).expect(/<title>Company/)
    })
    it('/about/ad should work', async () => {
      await request.get('/about/ad').expect(200).expect(/<title>Advertise/)
    })
    it('/about/privacy should work', async () => {
      await request.get('/about/privacy').expect(200).expect(/<title>Privacy/)
    })
    it('/about/help should work', async () => {
      await request.get('/about/help').expect(200).expect(/<title>Help/)
    })
  })

})

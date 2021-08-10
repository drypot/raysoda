import { Express2 } from '../../lib/express/express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'
import { loadConfig } from '../config/config.js'
import { initAbout } from './about.js'

describe('about pages', () => {

  let server: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfig('config/raysoda-test.json')
    server = new Express2(config)
    router = server.router
    request = server.spawnRequest()
    initAbout(server)
    await server.start()
  })

  afterAll(async () => {
    await server.close()
  })

  describe('get /about/site', () => {
    it('should work', async () => {
      await request.get('/about/site').expect(200)
    })
  })
  describe('get /about/company', () => {
    it('should work', async () => {
      await request.get('/about/company').expect(200)
    })
  })
  describe('get /about/ad', () => {
    it('should work', async () => {
      await request.get('/about/ad').expect(200)
    })
  })
  describe('get /about/privacy', () => {
    it('should work', async () => {
      await request.get('/about/privacy').expect(200)
    })
  })
  describe('get /about/help', () => {
    it('should work', async () => {
      await request.get('/about/help').expect(200)
    })
  })

})

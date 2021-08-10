import { loadConfig } from '../../app/config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

describe('Express2', () => {

  let server: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfig('config/app-test.json')
    server = new Express2(config)
    router = server.router
    request = server.spawnRequest()
    await server.start()
  })

  afterAll(async () => {
    await server.close()
  })

  it('can return html', async () => {
    router.get('/test/html', (req, res) => {
      res.send('<p>some text</p>')
    })
    const res = await request.get('/test/html')
    expect(res.type).toBe('text/html')
    expect(res.text).toBe('<p>some text</p>')
  })

})

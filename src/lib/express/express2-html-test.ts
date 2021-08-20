import { configFrom } from '../../config/config.js'
import { Express2 } from './express2.js'
import { Router } from 'express'
import { SuperAgentTest } from 'supertest'

describe('Express2', () => {

  let web: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = configFrom('config/app-test.json')
    web = await Express2.from(config).start()
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
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

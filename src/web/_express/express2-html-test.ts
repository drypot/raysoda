import { loadConfigSync } from '../../_util/config-loader.js'
import { Express2 } from './express2.js'
import { SuperAgentTest } from 'supertest'

describe('Express2 Html', () => {
  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfigSync('config/app-test.json')
    web = await Express2.from(config).start()
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  it('setup', () => {
    web.router.get('/html', (req, res) => {
      res.send('<p>some text</p>')
    })
  })
  it('can return html', async () => {
    const res = await request.get('/html').expect(200)
    expect(res.type).toBe('text/html')
    expect(res.text).toBe('<p>some text</p>')
  })

})

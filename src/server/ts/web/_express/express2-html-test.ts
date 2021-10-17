import { Express2 } from '@server/web/_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('Express2 Html', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    web = await omanGetObject('Express2') as Express2
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('setup', () => {
    web.router.get('/html', (req, res) => {
      res.send('<p>some text</p>')
    })
  })
  it('can return html', async () => {
    const res = await sat.get('/html').expect(200)
    expect(res.type).toBe('text/html')
    expect(res.text).toBe('<p>some text</p>')
  })

})

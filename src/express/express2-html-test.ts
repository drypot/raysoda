import { Express2, getExpress2 } from './express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../oman/oman.js'

describe('Express2 Html', () => {

  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    express2 = await getExpress2()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('setup', () => {
    express2.router.get('/html', (req, res) => {
      res.send('<p>some text</p>')
    })
  })
  it('can return html', async () => {
    const res = await agent.get('/html').expect(200)
    expect(res.type).toBe('text/html')
    expect(res.text).toBe('<p>some text</p>')
  })

})

import { Express2 } from './express2.js'
import supertest from 'supertest'
import { closeAllObjects, getObject, initObjectContext } from '../oman/oman.js'

import './express2.js'

describe('Express2 Html', () => {

  let web: Express2
  let sat: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    web = await getObject('Express2') as Express2
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await closeAllObjects()
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

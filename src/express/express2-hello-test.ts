import { Express2 } from './express2.js'
import supertest from 'supertest'
import { closeAllObjects, getObject, initObjectContext } from '../oman/oman.js'

import './express2.js'

describe('Express2 Hello', () => {

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

  it('hello', async () => {
    const res = await sat.get('/api/hello').expect(200)
    // expect(res.type).toBe('text/plain')
    // expect(res.text).toBe('hello')
    expect(res.type).toBe('application/json')
    expect(res.body).toBe('hello')
  })

})

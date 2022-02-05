import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { INVALID_DATA } from '@common/type/error-const'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'

describe('Express2 Error', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    web = await getObject('Express2') as Express2
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('404 if api url not exist', async () => {
    await sat.get('/api/test/undefined-url').expect(404)
  })
  it('404 if not handled', async () => {
    await sat.get('/api/no-action').expect(404)
  })
  it('404 if page url not exist', async () => {
    await sat.get('/undefined-page').expect(404).expect(/<title>Error/)
  })
  it('api INVALID_DATA', async () => {
    const res = await sat.get('/api/invalid-data').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('api [INVALID_DATA]', async () => {
    const res = await sat.get('/api/invalid-data-array').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('api system error', async () => {
    const res = await sat.get('/api/system-error').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err[0].name).toBe('Error')
    expect(res.body.err[0].message).toMatch(/System Error/)
    expect(res.body.err[0].field).toBe('_system')
  })
  it('page system error', async () => {
    const res = await sat.get('/system-error').expect(200).expect(/<title>Error/)
    expect(res.type).toBe('text/html')
  })

})

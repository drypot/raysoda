import { Express2 } from '@server/web/_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { INVALID_DATA } from '@common/type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('Express2 Error', () => {

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

  it('404 if url not exist', async () => {
    const res = await sat.get('/api/test/undefined-url').expect(404)
  })
  it('setup no action', () => {
    web.router.get('/api/no-action', function (req, res, done) {
      done()
    })
  })
  it('404 if not handled', async () => {
    const res = await sat.get('/api/no-action').expect(404)
  })
  it('setup invalid data', () => {
    web.router.get('/api/invalid-data', function (req, res, done) {
      done(INVALID_DATA)
    })
  })
  it('INVALID_DATA', async () => {
    const res = await sat.get('/api/invalid-data').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('setup invalid data[]', () => {
    web.router.get('/api/invalid-data-array', function (req, res, done) {
      done([INVALID_DATA])
    })
  })
  it('[INVALID_DATA]', async () => {
    const res = await sat.get('/api/invalid-data-array').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('setup system error', () => {
    web.router.get('/api/system-error', function (req, res, done) {
      done(new Error('System Error'))
    })
  })
  it('system error', async () => {
    const res = await sat.get('/api/system-error').expect(200)
    expect(res.type).toBe('application/json')
    expect(res.body.err[0].name).toBe('Error')
    expect(res.body.err[0].message).toBe('System Error')
  })
  it('setup page error', () => {
    web.router.get('/page-error', function (req, res, done) {
      done(new Error('Page Error'))
    })
  })
  it('page error', async () => {
    const res = await sat.get('/page-error').expect(200).expect(/<title>Error/)
    expect(res.type).toBe('text/html')
  })

})

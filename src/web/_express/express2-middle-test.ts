import { loadConfigSync } from '../../_util/config-loader.js'
import { Express2 } from './express2.js'
import { NextFunction, Request, Response } from 'express'
import supertest, { SuperAgentTest } from 'supertest'
import { renderJson } from '../api/_api/api.js'

describe('Express2 Middleware', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfigSync('config/app-test.json')
    web = Express2.from(config)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
  })

  let done1 = false
  let done2 = false
  let done3 = false

  function reset() {
    done1 = false
    done2 = false
    done3 = false
  }

  function mid1(req: Request, res: Response, done: NextFunction) {
    done1 = true
    done()
  }

  function mid2(req: Request, res: Response, done: NextFunction) {
    done2 = true
    done()
  }

  function midErr(req: Request, res: Response, done: NextFunction) {
    done(new Error('some error'))
  }

  it('setup', () => {
    web.router.get('/api/api-1-2-3', mid1, mid2, (req, res, done) => {
      done3 = true
      renderJson(res, {})
    })
  })
  it('api-1-2-3', async () => {
    await sat.get('/api/api-1-2-3').expect(200)
    expect(done1).toBe(true)
    expect(done2).toBe(true)
    expect(done3).toBe(true)
  })
  it('setup', () => {
    web.router.get('/api/api-1-err-2-3', mid1, midErr, mid2, (req, res, done) => {
      done3 = true
      renderJson(res, {})
    })
  })
  it('reset', () => {
    reset()
  })
  it('api-1-err-2-3', async () => {
    await sat.get('/api/api-1-err-2-3').expect(200)
    expect(done1).toBe(true)
    expect(done2).toBe(false)
    expect(done3).toBe(false)
  })

})

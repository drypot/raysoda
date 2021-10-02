import { loadConfigSync } from '../../_util/config-loader.js'
import { Express2 } from './express2.js'
import { NextFunction, Request, Response } from 'express'
import { SuperAgentTest } from 'supertest'

describe('Express2 Middleware', () => {
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
      res.json({})
    })
  })
  it('api-1-2-3', async () => {
    await request.get('/api/api-1-2-3').expect(200)
    expect(done1).toBe(true)
    expect(done2).toBe(true)
    expect(done3).toBe(true)
  })
  it('setup', () => {
    web.router.get('/api/api-1-err-2-3', mid1, midErr, mid2, (req, res, done) => {
      done3 = true
      res.json({})
    })
  })
  it('reset', () => {
    reset()
  })
  it('api-1-err-2-3', async () => {
    await request.get('/api/api-1-err-2-3').expect(200)
    expect(done1).toBe(true)
    expect(done2).toBe(false)
    expect(done3).toBe(false)
  })
})

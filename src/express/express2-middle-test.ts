import { NextFunction, Request, Response } from 'express'
import { Express2, getExpress2 } from './express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../oman/oman.js'

describe('Express2 Middleware', () => {

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

  let done1 = false
  let done2 = false
  let done3 = false
  let done4 = false

  function reset() {
    done1 = false
    done2 = false
    done4 = false
    done4 = false
  }

  function mid1(req: Request, res: Response, done: NextFunction) {
    done1 = true
    done()
  }

  function mid2(req: Request, res: Response, done: NextFunction) {
    done2 = true
    done()
  }

  function mid3(req: Request, res: Response, done: NextFunction) {
    done3 = true
  }

  function midErr(req: Request, res: Response, done: NextFunction) {
    done(new Error('some error'))
  }

  it('setup 1', () => {
    express2.router.get('/api/api1', mid1, mid2, (req, res, done) => {
      done4 = true
      res.json({})
    })
  })
  it('test 1', async () => {
    await agent.get('/api/api1').expect(200)
    expect(done1).toBe(true)
    expect(done2).toBe(true)
    expect(done4).toBe(true)
  })

  it('reset', () => {
    reset()
  })
  it('setup 2', () => {
    express2.router.get('/api/api2', mid1, midErr, mid2, (req, res, done) => {
      done4 = true
      res.json({})
    })
  })
  it('test 2', async () => {
    await agent.get('/api/api2').expect(200)
    expect(done1).toBe(true)
    expect(done2).toBe(false)
    expect(done4).toBe(false)
  })

  it('reset', () => {
    reset()
  })
  it('setup 3', () => {
    express2.router.get('/api/api3', (req, res, done) => {
      done4 = true
      res.json({})
    }, mid1)
  })
  it('test 3', async () => {
    await agent.get('/api/api3').expect(200)
    expect(done1).toBe(false)
    expect(done4).toBe(true)
  })

})

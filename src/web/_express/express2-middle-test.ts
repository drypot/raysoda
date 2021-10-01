import { readConfigSync } from '../../_util/config-loader.js'
import { Express2 } from './express2.js'
import { NextFunction, Request, Response } from 'express'
import { SuperAgentTest } from 'supertest'

describe('Express2', () => {

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = readConfigSync('config/app-test.json')
    web = await Express2.from(config).start()
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  describe('middleware', () => {

    let result: {
      mid1?: string
      mid2?: string
      mid3?: string
    }

    beforeAll(() => {
      function mid1(req: Request, res: Response, done: NextFunction) {
        result.mid1 = 'ok'
        done()
      }

      function mid2(req: Request, res: Response, done: NextFunction) {
        result.mid2 = 'ok'
        done()
      }

      function midErr(req: Request, res: Response, done: NextFunction) {
        done(new Error('some error'))
      }

      web.router.get('/api/test/mw-1-2', mid1, mid2, (req, res, done) => {
        result.mid3 = 'ok'
        res.json({})
      })

      web.router.get('/api/test/mw-1-err-2', mid1, midErr, mid2, (req, res, done) => {
        result.mid3 = 'ok'
        res.json({})
      })
    })

    beforeEach(() => {
      result = {}
    })

    describe('mw-1-2 ', () => {
      it('should set 1, 2, 3', async () => {
        const res = await request.get('/api/test/mw-1-2').expect(200)
        expect(result.mid1).toBe('ok')
        expect(result.mid2).toBe('ok')
        expect(result.mid3).toBe('ok')
      })
    })

    describe('mw-1-err-2', () => {
      it('should set 1, 2', async () => {
        const res = await request.get('/api/test/mw-1-err-2').expect(200)
        expect(result.mid1).toBe('ok')
        expect(result.mid2).toBeUndefined()
        expect(result.mid3).toBeUndefined()
      })
    })
  })

})

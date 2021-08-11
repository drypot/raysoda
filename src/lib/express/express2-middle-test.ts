import { loadConfig } from '../../app/config/config.js'
import { Express2 } from './express2.js'
import { NextFunction, Request, Response, Router } from 'express'
import { SuperAgentTest } from 'supertest'

describe('Express2', () => {

  let web: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfig('config/app-test.json')
    web = new Express2(config)
    await web.start()
    router = web.router
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

      router.get('/api/test/mw-1-2', mid1, mid2, (req, res, done) => {
        result.mid3 = 'ok'
        res.json({})
      })

      router.get('/api/test/mw-1-err-2', mid1, midErr, mid2, (req, res, done) => {
        result.mid3 = 'ok'
        res.json({})
      })
    })

    beforeEach(() => {
      result = {}
    })

    describe('mw-1-2 ', () => {
      it('should set 1, 2, 3', async () => {
        const res = await request.get('/api/test/mw-1-2')
        expect(result.mid1).toBe('ok')
        expect(result.mid2).toBe('ok')
        expect(result.mid3).toBe('ok')
      })
    })

    describe('mw-1-err-2', () => {
      it('should set 1, 2', async () => {
        const res = await request.get('/api/test/mw-1-err-2')
        expect(result.mid1).toBe('ok')
        expect(result.mid2).toBeUndefined()
        expect(result.mid3).toBeUndefined()
      })
    })
  })

})

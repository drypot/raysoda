import express, { ErrorRequestHandler, Express, NextFunction, Request, Response, Router } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import * as http from 'http'
import supertest from 'supertest'
import { Config } from '../../config/config.js'
import newMulter, { Multer } from 'multer'
import { emptyDir, mkdirRecursive } from '../../lib/base/fs2.js'
import { unlinkSync } from 'fs'

type ExpressHandler = (req: Request, res: Response, done: NextFunction) => void

export class Express2 {

  public config: Config
  private readonly httpServer: http.Server
  private readonly expr1: Express
  private multer: Multer | undefined
  public readonly router: Router

  public autoLogin: ExpressHandler = (req, res, done) => {
    done()
  }
  public redirectToLogin: ErrorRequestHandler = (err, req, res, done) => {
    done(err)
  }

  private constructor(config: Config) {
    this.config = config
    this.expr1 = express()
    this.router = express.Router()
    this.httpServer = http.createServer(this.expr1)

    this.expr1.disable('x-powered-by')

    const locals = this.expr1.locals
    locals.pretty = true
    locals.appName = config.appName
    locals.appNamel = config.appNamel
    locals.appDesc = config.appDesc

    this.setViewEngine('pug', 'src/web/view')
  }

  static from(config: Config) {
    return new Express2(config)
  }

  setLocals(name: string, value: any) {
    this.expr1.locals[name] = value
    return this
  }

  setViewEngine(engine: string, root: string) {
    this.expr1.set('view engine', engine)
    this.expr1.set('views', root)
    return this
  }

  private _useUpload = false

  useUpload() {
    this._useUpload = true
    return this
  }

  static apiPattern = /^\/api\//

  async start() {
    this.expr1.use(function (req, res, done) {
      res.locals.query = req.query
      res.locals.api = Express2.apiPattern.test(req.path)
      done()
    })
    this.setUpSessionHandler()
    this.setUpBodyParser()
    this.setUpCacheControl()
    this.setUpAutoLoginHandler()
    this.setUpGeneralRouter()
    this.setUpBasicAPI()
    this.setUpRedirectToLoginHandler()
    this.setUpErrorHandler()
    if (this._useUpload) {
      await this.initMulter()
    }
    return new Promise<Express2>((resolve) => {
      this.httpServer.listen(this.config.port, () => {
        resolve(this)
      })
    })
  }

  close() {
    return new Promise<void>((resolve, reject) => {
      if (!this.httpServer) return resolve()
      this.httpServer.close((err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  spawnRequest() {
    return supertest.agent(this.httpServer)
  }

  private setUpSessionHandler() {
    this.expr1.use(cookieParser())

    const redisClient = redis.createClient({
      host: 'localhost',
      port: 6379,
      db: 1,
    })
    redisClient.unref()
    redisClient.on('error', console.log)

    const RedisStore = connectRedis(session)

    this.expr1.use(session({
      store: new RedisStore({ client: redisClient }),
      resave: false,
      saveUninitialized: false,
      secret: this.config.cookieSecret
    }))
  }

  private setUpBodyParser() {
    this.expr1.use(bodyParser.urlencoded({ extended: false }))
    this.expr1.use(bodyParser.json())
  }

  private setUpCacheControl() {
    // Cache-Control + etc

    this.expr1.use(function (req, res, done) {
      // Response 의 Content-Type 을 지정할 방법을 마련해 두어야한다.
      // 각 핸들러에서 res.send(), res.json() 으로 Content-Type 을 간접적으로 명시할 수도 있지만
      // 에러 핸들러는 공용으로 사용하기 때문에 이 방식에 의존할 수 없다.
      //
      // req.xhr:
      //   node + superagent 로 테스트할 시에는 Fail.
      //
      // req.is('json'):
      //   superagent 로 GET 할 경우 매번 type('json') 을 명시해야하며
      //   그렇게 한다 하여도 Content-Length: 0 인 GET 을 type-is 가 제대로 처리하지 못하고 null 을 리턴한다. Fail.
      //
      // 위와 같이 클라이언트에서 보내주는 정보에 의존하는 것은 불안정하다.
      // 해서 /api/ 로 들어오는 Request 에 대한 에러 Content-Type 은 일괄 json 으로 한다.
      if (res.locals.api) {
        // IE 는 웹페이지까지만 refresh 하고 ajax request 는 refresh 하지 않는다.
        res.set('Cache-Control', 'no-cache')
      } else {
        // force web page cached.
        res.set('Cache-Control', 'private')
      }
      done()
    })
  }

  private setUpAutoLoginHandler() {
    const handler: ExpressHandler = (req, res, done) => {
      this.autoLogin(req, res, done)
    }
    this.expr1.use(handler)
  }

  private setUpGeneralRouter() {
    // 테스트케이스에서 인스턴스가 기동한 후 핸들러를 추가하는 경우가 있어 router 를 따로 두었다.
    this.expr1.use(this.router)
  }

  private setUpBasicAPI() {
    this.expr1.get('/api/hello', function (req, res, done) {
      res.json({
        message: 'hello',
        time: Date.now()
      })
    })

    this.expr1.all('/api/echo', function (req, res, done) {
      res.json({
        method: req.method,
        rtype: req.header('content-type'),
        query: req.query,
        body: req.body
      })
    })

    this.expr1.get('/api/cookies', function (req, res, done) {
      res.json(req.cookies)
    })

    this.expr1.post('/api/destroy-session', function (req, res, done) {
      req.session.destroy((err: any) => {
        res.json({})
      })
    })
  }

  // 4인자 에러 핸들러이므로 뒷쪽에 있어야 한다
  private setUpRedirectToLoginHandler() {
    const handler: ErrorRequestHandler = (err, req, res, done) => {
      this.redirectToLogin(err, req, res, done)
    }
    this.expr1.use(handler)
  }

  // 4인자 에러 핸들러이므로 뒷쪽에 있어야 한다
  private setUpErrorHandler() {
    const _this = this
    this.expr1.use(function (_err: any, req: Request, res: Response, done: NextFunction) {
      let obj
      if (_err instanceof Array) {
        obj = {
          errType: 'array',
          err: _err
        }
      } else if ('field' in _err) {
        obj = {
          errType: 'form',
          err: _err
        }
      } else {
        obj = {
          errType: 'system',
          err: {
            name: _err.name,
            message: _err.message,
            stack: _err.stack,
          }
        }
      }
      res.json(obj)
    })
  }

  private async initMulter() {
    if (!this.multer) {
      if (!this.config.uploadDir) throw new Error('config.uploadDir should be defined')
      const tmp = this.config.uploadDir + '/tmp'
      await mkdirRecursive(tmp)
      await emptyDir(tmp)
      this.multer = newMulter({ dest: tmp })
    }
  }

  get upload(): Multer {
    return this.multer as Multer
  }

}

export function deleteUpload(handler: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, done: NextFunction) => {
    handler(req, res)
      .catch(done)
      .finally(() => {
        if (req.file) {
          unlinkSync(req.file.path)
        }
        if (req.files) {
          for (const file of req.files as Express.Multer.File[]) {
            unlinkSync(file.path)
          }
        }
      })
  }
}

export function toCallback(handler: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, done: NextFunction) => {
    handler(req, res).then(done, done)
  }
}

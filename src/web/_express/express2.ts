import _express, { ErrorRequestHandler, Express, NextFunction, Request, Response, Router } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import redis from 'redis'
import expressSession from 'express-session'
import connectRedis from 'connect-redis'
import * as http from 'http'
import newMulter, { Multer } from 'multer'
import { emptyDirSync, mkdirRecursiveSync } from '../../_util/fs2.js'
import { unlinkSync } from 'fs'
import { newErrorConst } from '../../_util/error2.js'
import { Config } from '../../_type/config.js'

type ExpressHandler = (req: Request, res: Response, done: NextFunction) => void

declare module 'express-session' {
  interface SessionData {
    [key: string]: any
  }
}

export class Express2 {

  public readonly config: Config
  public readonly server: http.Server
  public readonly express: Express
  public readonly router: Router
  private multer: Multer | undefined

  public autoLogin: ExpressHandler = (req, res, done) => {
    done()
  }
  public redirectToLogin: ErrorRequestHandler = (err, req, res, done) => {
    done(err)
  }

  private constructor(config: Config) {
    this.config = config
    this.express = _express()
    this.router = _express.Router()
    this.server = http.createServer(this.express)

    this.express.disable('x-powered-by')

    const locals = this.express.locals
    locals.pretty = true
    locals.appName = config.appName
    locals.appNamel = config.appNamel
    locals.appDesc = config.appDesc

    this.setViewEngine('pug', 'src/web/pug')
  }

  static from(config: Config) {
    return new Express2(config)
  }

  setViewEngine(engine: string, root: string) {
    this.express.set('view engine', engine)
    this.express.set('views', root)
    return this
  }

  // Upload

  useUpload() {
    if (!this.multer) {
      if (!this.config.uploadDir) {
        throw new Error('config.uploadDir should be defined')
      }
      const tmp = this.config.uploadDir + '/tmp'
      mkdirRecursiveSync(tmp)
      emptyDirSync(tmp)
      this.multer = newMulter({ dest: tmp })
    }
    return this
  }

  get upload(): Multer {
    return this.multer as Multer
  }

  // Start & Close

  static apiPattern = /^\/api\//

  async start() {
    this.express.use(function (req, res, done) {
      res.locals.query = req.query
      res.locals.api = Express2.apiPattern.test(req.path)
      done()
    })
    this.setUpSessionHandler()
    this.setUpBodyParser()
    this.setUpCacheControl()
    this.setUpAutoLoginHandler()
    this.setUpGeneralRouter()
    this.setUpRedirectToLoginHandler()
    this.setUpErrorHandler()
    return new Promise<Express2>((resolve) => {
      this.server.listen(this.config.port, () => {
        resolve(this)
      })
    })
  }

  close() {
    return new Promise<void>((resolve, reject) => {
      if (!this.server) return resolve()
      this.server.close((err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  private setUpSessionHandler() {
    this.express.use(cookieParser())

    const redisClient = redis.createClient({
      host: 'localhost',
      port: 6379,
      db: 1,
    })
    redisClient.unref()
    redisClient.on('error', console.log)

    const RedisStore = connectRedis(expressSession)

    this.express.use(expressSession({
      store: new RedisStore({ client: redisClient }),
      resave: false,
      saveUninitialized: false,
      secret: this.config.cookieSecret
    }))
  }

  private setUpBodyParser() {
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use(bodyParser.json())
  }

  private setUpCacheControl() {
    // Cache-Control + etc

    this.express.use(function (req, res, done) {
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
    this.express.use(handler)
  }

  private setUpGeneralRouter() {
    // 테스트케이스에서 인스턴스가 기동한 후 핸들러를 추가하는 경우가 있어 router 를 따로 두었다.
    this.express.use(this.router)
  }

  // 4인자 에러 핸들러이므로 뒷쪽에 있어야 한다
  private setUpRedirectToLoginHandler() {
    const handler: ErrorRequestHandler = (err, req, res, done) => {
      this.redirectToLogin(err, req, res, done)
    }
    this.express.use(handler)
  }

  // 4인자 에러 핸들러이므로 뒷쪽에 있어야 한다
  private setUpErrorHandler() {
    const _this = this
    this.express.use(function (err: any, req: Request, res: Response, done: NextFunction) {
      if (err instanceof Array) {
        // do nothing
      } else if ('field' in err) {
        err = [err]
      } else {
        err = [newErrorConst(err.name, err.message, err.stack)]
      }
      if (res.locals.api) {
        res.json({ err });
      } else {
        res.render('system/error', { err });
      }
    })
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

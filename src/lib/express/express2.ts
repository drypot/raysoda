import express from 'express'
import { Request, Response, NextFunction, Express, Router } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { FormError } from '../base/error2.js'
import * as http from 'http'
import supertest, { SuperAgentTest } from 'supertest'
import { Config } from '../config/config.js'

type ExpressHandler = (req: Request, res: Response, done: NextFunction) => void

export class Express2 {

  private readonly config: Config
  private readonly httpServer: http.Server
  private readonly expr1: Express
  public readonly router: Router

  public autoLogin: ExpressHandler | undefined
  public redirectToLogin: ExpressHandler | undefined

  public logError: boolean

  constructor(config: Config) {
    this.config = config
    this.expr1 = express()
    this.router = express.Router()
    this.httpServer = http.createServer(this.expr1)

    this.autoLogin = undefined
    this.logError = false
    this.redirectToLogin = undefined

    this.expr1.disable('x-powered-by')

    const locals = this.expr1.locals
    locals.pretty = true
    locals.appName = config.appName;
    locals.appNamel = config.appNamel;
    locals.appDesc = config.appDesc;

    this.setViewEngine('pug', 'src')
  }

  static startTest(config: Config, done: (err: any, server: Express2, router: Router, request: SuperAgentTest) => void) {
    let server = new Express2(config)
    let router = server.router
    let request = server.spawnRequest()
    server.start(() => {
      done(null, server, router, request)
    })
  }

  setLocals(name: string, value: any) {
    this.expr1.locals[name] = value
  }

  setViewEngine(engine: string, root: string) {
    this.expr1.set('view engine', engine)
    this.expr1.set('views', root)
  }

  start(done: () => void) {
    this.expr1.use(function (req, res, done) {
      res.locals.query = req.query
      res.locals.api = /^\/api\//.test(req.path)
      done()
    })
    this.setUpSessionHandler()
    this.setUpBodyParser()
    this.setUpCacheControl()
    this.setUpAutoLoginHandler()
    this.setUpGeneralRouter()
    this.setUpTestAPI()
    this.setUpRedirectToLoginHandler()
    this.setUpErrorHandler()
    this.httpServer.listen(this.config.port, done)
  }

  close(done: (err: any) => void) {
    if (this.httpServer) {
      this.httpServer.close(done)
    } else {
      done(null)
    }
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
    if (this.autoLogin) {
      this.expr1.use(this.autoLogin)
    }
  }

  private setUpGeneralRouter() {
    // 테스트케이스에서 인스턴스가 기동한 후 핸들러를 추가하는 경우가 있어 router 를 따로 두었다.
    this.expr1.use(this.router)
  }

  private setUpRedirectToLoginHandler() {
    if (this.redirectToLogin) {
      this.expr1.use(this.redirectToLogin)
    }
  }

  private setUpTestAPI() {
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

    this.expr1.post('/api/destroy-session', function (req, res, done) {
      req.session.destroy((err: any) => {
        res.json({})
      })
    })

    this.expr1.get('/api/cookies', function (req, res, done) {
      res.json(req.cookies)
    })
  }

  private setUpErrorHandler() {
    const _this = this
    this.expr1.use(function (_err: any, req: Request, res: Response, done: NextFunction) {
      let obj = undefined
      if (_err instanceof FormError) {
        obj = {
          errType: 'form',
          err: _err
        }
      } else if (_err instanceof Array) {
        obj = {
          errType: 'form',
          err: _err
        }
      } else {
        obj = {
          errType: 'system',
          err: _err
        }
      }
      if (_this.logError) {
        console.error(obj)
      }
      if (res.locals.api) {
        res.json(obj)
      } else {
        res.render('lib/express/view/express-error', obj)
      }
    })
  }

}
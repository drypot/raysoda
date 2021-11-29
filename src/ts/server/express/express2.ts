import _express, { ErrorRequestHandler, Express, NextFunction, Request, Response, Router } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import redis from 'redis'
import expressSession from 'express-session'
import connectRedis from 'connect-redis'
import * as http from 'http'
import { newErrorConst } from '@common/util/error2'
import { Config } from '@common/type/config'
import { inDev, inProduction } from '@common/util/env2'
import { omanGetConfig, omanRegisterCloser, omanRegisterFactory } from '../oman/oman'
import { INVALID_DATA } from '@common/type/error-const'
import { renderJson } from '@server/express/response'

export type ExpressCallbackHandler = (req: Request, res: Response, done: NextFunction) => void
export type ExpressPromiseHandler = (req: Request, res: Response) => Promise<void>

declare module 'express-session' {
  interface SessionData {
    [key: string]: any
  }
}

omanRegisterFactory('Express2', async () => {
  const web = Express2.from(omanGetConfig())
  omanRegisterCloser(async () => {
    await web.close()
  })
  return web
})

export class Express2 {

  readonly config: Config
  readonly server: http.Server
  readonly express: Express
  readonly router: Router

  logError = false

  static from(config: Config) {
    return new Express2(config)
  }

  private constructor(config: Config) {
    this.config = config
    this.express = _express()
    this.router = _express.Router()
    this.server = http.createServer(this.express)

    this.express.disable('x-powered-by')
    this.express.locals.pretty = true
    this.express.locals.config = config

    this.useViewCache()

    //this.usePug()
    //this.useEta()
    this.useEjs()
  }

  private useViewCache() {
    // 자세한 내용은 Obsidian Express Cache 메모를 확인한다.
    //
    // 캐쉬는 Express 에도 있고 템플릿 엔진들에도 있다.
    // 보통 Express 캐쉬를 쓰면 무난하다.
    //
    // Express 캐쉬는 'view cache' 으로 컨트롤하는데
    // 이 옵션은 NODE_ENV 값에 따라서 자동 설정된다.
    // 해서 따로 수작업 설정할 필요는 없다.
    //
    // console.log(this.express.settings['view cache'])
    // this.express.set('view cache', true)

    // 템플렛 엔진 자체에도 캐쉬들이 있긴 하다.
    //
    // 정 세팅한다면, Eta 의 경우, eta.config.cache 를 쓰는데
    // 이 값은 eta.renderFile 에서 Express cache 플래그로 오버라이딩 된다.
    // 그래서 Express 와 쓸 때는 설정할 의미가 없다.
    //
    // 오버라이딩 된 것을 다시 덮어쓰려면 Express 'view options' 를 사용하면 되지만
    //
    // this.express.set('view options', {
    //   cache: true,
    // })
    //
    // 그냥 Express 기본 캐쉬를 쓰는 것으로.
  }

  private useEjs() {
    this.express.set('view engine', 'ejs')
    this.express.set('views', 'src/template/ejs')
    this.express.set('view options', {
      _with: false,
      localsName: 'locals',
      rmWhitespace: inProduction(),
    })
  }

  private usePug() {
    this.express.set('view engine', 'pug')
    this.express.set('views', 'src/template/pug')
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
    this.setUpBasicHandler()
    this.setUpErrorHandler()
    return new Promise<Express2>((resolve) => {
      this.server.listen(this.config.port, () => {
        resolve(this)
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
    this.express.use(function (req, res, done) {
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

  public autoLoginHandler: ExpressCallbackHandler | undefined

  private setUpAutoLoginHandler() {
    if (this.autoLoginHandler) {
      this.express.use(this.autoLoginHandler)
    }
  }

  private setUpGeneralRouter() {
    // 테스트케이스에서 인스턴스가 기동한 후 핸들러를 추가하는 경우가 있어 router 를 따로 두었다.
    this.express.use(this.router)
  }

  private setUpBasicHandler() {

    // 클라이언트에서 Ping 에 사용한다.
    this.express.get('/api/hello', function (req, res) {
      // res.setHeader('content-type', 'text/plain')
      // res.send('hello')
      renderJson(res, 'hello')
    })

    // 테스트용.
    if (inDev()) {
      this.express.get('/api/no-action', function (req, res, done) {
        done()
      })

      this.express.get('/api/invalid-data', function (req, res, done) {
        done(INVALID_DATA)
      })

      this.express.get('/api/invalid-data-array', function (req, res, done) {
        done([INVALID_DATA])
      })

      this.express.get('/api/system-error', function (req, res, done) {
        done(new Error('System Error'))
      })

      this.express.get('/hello', (req, res) => {
        res.send('<html><body><h1>Hello</h1></body></html>')
      })

      this.express.get('/invalid-data', function (req, res) {
        throw INVALID_DATA
      })

      this.express.get('/invalid-data-array', function (req, res) {
        throw [INVALID_DATA]
      })

      this.express.get('/system-error', function (req, res) {
        throw new Error('System Error')
      })
    }

    // 404 Error Handler
    this.express.use((req, res, done) => {
      res.status(404)
      done(newErrorConst('INVALID_PAGE', req.path))
    })

  }

  // 4인자 에러 핸들러는 맨 마지막에 둔다.
  private setUpErrorHandler() {
    const handler: ErrorRequestHandler = (err, req, res, done) => {
      if (err instanceof Error) {
        err = [newErrorConst(err.name, /*err.message + */ err.stack, '_system')]
      } else if (err instanceof Array) {
        // do nothing
      } else {
        err = [err]
      }

      // Response 의 Content-Type 을 지정할 방법을 마련해 두어야한다.
      // 각 핸들러에서 res.send(), res.json() 으로 Content-Type 을 간접적으로 명시할 수도 있지만
      // 에러 핸들러는 공용으로 사용하기 때문에 이 방식에 의존할 수 없다.
      //
      // req.xhr:
      //   node + superagent 로 테스트할 시에는 Fail.
      //
      // req.is('json'):
      //   superagent 로 GET 할 경우 매번 type('json') 을 명시해야하며
      //   그렇게 한다 하여도 Content-Length: 0 인 GET 을
      //   type-is 가 제대로 처리하지 못하고 null 을 리턴한다. Fail.
      //
      // 위와 같이 클라이언트에서 보내주는 정보에 의존하는 것은 불안정하다.
      // 해서 /api/ 로 들어오는 Request 에 대한 에러 Content-Type 은 일괄 json 으로 한다.

      if (this.logError) {
        console.error(err)
      }
      if (res.locals.api) {
        res.json({ err })
      } else {
        res.render('_common/error', { err })
      }
    }
    this.express.use(handler)
  }

  close() {
    return new Promise<void>((resolve, reject) => {
      if (!this.server)
        return resolve()
      this.server.close((err) => {
        if (err)
          return reject(err)
        resolve()
      })
    })
  }

}

export function toCallback(handler: ExpressPromiseHandler): ExpressCallbackHandler {
  return (req, res, done) => {
    handler(req, res).catch(done)
  }
}

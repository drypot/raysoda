import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { FormError } from '../base/error.mjs'

const redisStore = connectRedis(session)

export class WebServer {

  #server
  #router

  #autoLogin
  #logError
  #redirectToLogin

  constructor() {
    const server = express()

    this.#server = server
    this.#router = express.Router()

    this.#autoLogin = null
    this.#logError = false
    this.#redirectToLogin = null

    server.disable('x-powered-by')
    server.locals.pretty = true

    server.set('view engine', 'pug')
    server.set('views', 'src')
  }

  // get server() {
  //   return this.#server
  // }

  get router() {
    return this.#router
  }

  set autoLogin(f) {
    this.#autoLogin = f
  }

  set redirectToLogin(f) {
    this.#redirectToLogin = f
  }

  set logError(b) {
    this.#logError = b
  }

  setLocals(name, value) {
    this.#server.locals[name] = value
  }

  setViewEngine(engine, root) {
    this.#server.set('view engine', engine)
    this.#server.set('views', root)
  }

  start(port, cookieSecret) {

    const server = this.#server
    const _this = this

    server.use(cookieParser())

    let redisClient = redis.createClient({
      host: 'localhost',
      port: 6379,
      db: 1,
    })
    redisClient.unref()
    redisClient.on('error', console.log)

    server.use(session({
      store: new redisStore({ client: redisClient }),
      resave: false,
      saveUninitialized: false,
      secret: cookieSecret
    }))

    server.use(bodyParser.urlencoded({ extended: false }))
    server.use(bodyParser.json())

    // Cache-Control + etc

    server.use(function (req, res, done) {
      res.locals.query = req.query

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

      res.locals.api = /^\/api\//.test(req.path)
      if (res.locals.api) {
        // IE 는 웹페이지까지만 refresh 하고 ajax request 는 refresh 하지 않는다.
        res.set('Cache-Control', 'no-cache')
      } else {
        // force web page cached.
        res.set('Cache-Control', 'private')
      }
      done()
    })

    if (this.#autoLogin) {
      server.use(this.#autoLogin)
    }

    // 테스트케이스에서 인스턴스가 기동한 후 핸들러를 추가하는 경우가 있어 #router를 따로 두었다.

    server.use(this.#router)

    // for test

    server.get('/api/hello', function (req, res, done) {
      res.json({
        message: 'hello',
        time: Date.now()
      })
    })

    server.all('/api/echo', function (req, res, done) {
      res.json({
        method: req.method,
        rtype: req.header('content-type'),
        query: req.query,
        body: req.body
      })
    })

    server.post('/api/destroy-session', function (req, res, done) {
      req.session.destroy()
      res.json({})
    })

    server.get('/api/cookies', function (req, res, done) {
      res.json(req.cookies)
    })

    if (this.#redirectToLogin) {
      server.use(this.#redirectToLogin)
    }

    // error handler

    server.use(function (_err, req, res, done) {
      let err = undefined
      if (_err instanceof FormError) {
        err = {
          type: 'form',
          ..._err
        }
      } else if (_err instanceof Array) {
        err = {
          type: 'array',
          errors: _err
        }
      } else {
        err = {
          type: 'system',
          ..._err
        }
      }
      if (_this.#logError) {
        console.error(err)
      }
      if (res.locals.api) {
        res.json({ err: err })
      } else {
        res.render('express/express-error', { err: err })
      }
    })

    server.listen(port)
  }
}

import { Express2, toCallback } from '../../_express/express2.js'
import { NextFunction, Request, Response } from 'express'
import { newGuest, User, userIsAdmin, userIsUser } from '../../../_type/user.js'
import { newString } from '../../../_util/primitive.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../_type/error-user.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'
import { newLoginUser } from '../../../_type/user-login.js'
import { loginService } from '../../../service/user-login/login-service.js'

const guest = newGuest()

export function registerLoginApi(web: Express2, uc: UserCache) {
  const router = web.router

  router.post('/api/login', toCallback(async (req, res) => {
    const email = newString(req.body.email).trim()
    const password = newString(req.body.password).trim()
    const remember = !!req.body.remember
    const err: ErrorConst[] = []
    const user = await loginService(uc, email, password, err)
    if (!user || err.length) throw err
    if (remember) {
      res.cookie('email', email, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
      res.cookie('password', password, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
    }
    await createSession(req, user)
    setLocalsUser(res, user)
    res.json({
      user: newLoginUser(user)
    })
  }))

  async function createSession(req: Request, user: User) {
    await new Promise<void>((resolve, reject) =>
      req.session.regenerate(err => err ? reject(err) : resolve())
    )
    req.session.uid = String(user.id)
  }

  function setLocalsUser(res: Response, user: User) {
    res.locals.user = user
  }

  web.autoLogin = toCallback(async (req, res) => {
    // 이미 로그인 되어있는 상태 라면
    if (req.session.uid) {
      const user = await uc.getCachedById(Number(req.session.uid)) as User
      setLocalsUser(res, user)
      return
    }
    const email = req.cookies.email
    const password = req.cookies.password
    // 자동 로그인을 위한 쿠키 세팅이 없다면
    if (!email || !password) {
      setLocalsUser(res, guest)
      return
    }
    const err: ErrorConst[] = []
    const user = await loginService(uc, email, password, err)
    // 자동 로그인 인증이 실패했을 경우
    if (!user) {
      res.clearCookie('email')
      res.clearCookie('password')
      setLocalsUser(res, guest)
      return
    }
    // 자동 로그인이 성공한 경우
    await createSession(req, user)
    setLocalsUser(res, user)
  })

  router.get('/api/login-info', toCallback(async function (req, res) {
    const user = getUser(res)
    shouldBeUser(user)
    res.json({
      user: newLoginUser(user)
    })
  }))

  router.get('/api/login-info-admin', toCallback(async function (req, res) {
    const user = getUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    res.json({
      user: newLoginUser(user)
    })
  }))

  router.post('/api/logout', toCallback(async (req, res) => {
    await logout(req, res)
    res.json({})
  }))

  web.redirectToLogin = function (err: any, req: Request, res: Response, done: NextFunction) {
    if (!res.locals.api && (
      err.name === NOT_AUTHENTICATED.name ||
      err.name === NOT_AUTHORIZED.name
    )) {
      res.redirect('/login')
    } else {
      done(err)
    }
  }
}

export function getUser(res: Response) {
  return res.locals.user as User
}

export function shouldBeUser(user: User) {
  if (!userIsUser(user)) throw NOT_AUTHENTICATED
}

export function shouldBeAdmin(user: User) {
  if (!userIsAdmin(user)) throw NOT_AUTHORIZED
}

export function hasUpdatePerm(op: User, id: number) {
  return op.id === id || op.admin
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('email')
  res.clearCookie('password')
  await new Promise<void>((resolve, reject) =>
    req.session.destroy(err => err ? reject(err) : resolve())
  )
}

import { Express2, toCallback } from '../../_express/express2.js'
import { NextFunction, Request, Response } from 'express'
import { GUEST, newUserIdCard, User, userIsAdmin, userIsUser } from '../../../_type/user.js'
import { newString } from '../../../_util/primitive.js'
import {
  ACCOUNT_DEACTIVATED,
  EMAIL_NOT_FOUND,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  PASSWORD_WRONG
} from '../../../_type/error-user.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'
import { checkHash } from '../../../_util/hash.js'
import { renderJson } from '../_common/render-json.js'

export function registerLoginApi(web: Express2, uc: UserCache) {

  web.router.get('/api/login-info', toCallback(async function (req, res) {
    const user = getSessionUser(res)
    renderJson(res, {
      user: newUserIdCard(user)
    })
  }))

  web.router.post('/api/login', toCallback(async (req, res) => {
    const email = newString(req.body.email).trim()
    const password = newString(req.body.password).trim()
    const remember = !!req.body.remember
    const err: ErrorConst[] = []
    const user = await loginService(req, res, uc, email, password, remember, err)
    if (!user || err.length) throw err
    renderJson(res, {
      user: newUserIdCard(user)
    })
  }))

  web.autoLogin = toCallback(async (req, res) => {
    await autoLoginService(req, res, uc)
  })

  web.router.post('/api/logout', toCallback(async (req, res) => {
    await logoutService(req, res)
    renderJson(res, {})
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

export async function loginService(
  req: Request, res: Response, uc: UserCache, email: string, password: string, remember: boolean, err: ErrorConst[]
) {
  const user = await uc.getCachedByEmailForce(email)
  if (!user) {
    err.push(EMAIL_NOT_FOUND)
    return
  }
  if (user.status === 'd') {
    err.push(ACCOUNT_DEACTIVATED)
    return
  }
  if (!await checkHash(password, user.hash)) {
    err.push(PASSWORD_WRONG)
    return
  }

  user.adate = new Date()
  await uc.udb.updateADate(user.id, user.adate)

  if (remember) {
    res.cookie('email', email, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
    res.cookie('password', password, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
  }

  await new Promise<void>((resolve, reject) =>
    req.session.regenerate(err => err ? reject(err) : resolve())
  )
  req.session.uid = String(user.id)

  res.locals.user = user

  return user
}

async function autoLoginService(req: Request, res: Response, uc: UserCache) {
  // 이미 로그인 되어있는 상태 라면
  if (req.session.uid) {
    const user = await uc.getCachedById(Number(req.session.uid)) as User
    res.locals.user = user
    return
  }
  res.locals.user = GUEST

  const email = req.cookies.email
  const password = req.cookies.password

  // 자동 로그인을 위한 쿠키 세팅이 없다면
  if (!email || !password) {
    return
  }

  const err: ErrorConst[] = []
  const user = await loginService(req, res, uc, email, password, false, err)

  // 자동 로그인이 실패했다면
  if (!user) {
    res.clearCookie('email')
    res.clearCookie('password')
  }
}

export async function logoutService(req: Request, res: Response) {
  res.clearCookie('email')
  res.clearCookie('password')
  await new Promise<void>((resolve, reject) =>
    req.session.destroy(err => err ? reject(err) : resolve())
  )
}

export function getSessionUser(res: Response) {
  return res.locals.user as User
}

export function shouldBeUser(user: User) {
  if (!userIsUser(user)) throw NOT_AUTHENTICATED
}

export function shouldBeAdmin(user: User) {
  if (!userIsAdmin(user)) throw NOT_AUTHORIZED
}

export function userCanUpdateUser(op: User, id: number) {
  return op.id === id || op.admin
}

import { Express2, toCallback } from '../../../_express/express2'
import { Request, Response } from 'express'
import { GUEST, newUserIdCard, User } from '../../../../_type/user'
import { newString } from '../../../../_util/primitive'
import {
  ACCOUNT_DEACTIVATED,
  EMAIL_NOT_FOUND,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  PASSWORD_WRONG
} from '../../../../_type/error-user'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { ErrorConst } from '../../../../_type/error'
import { checkHash } from '../../../../_util/hash'
import { renderJson } from '../../_common/render-json'

export function registerUserAuthApi(web: Express2, uc: UserCache) {

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
    const user = await userLoginService(req, res, uc, email, password, remember, err)
    if (!user || err.length) throw err
    renderJson(res, {
      user: newUserIdCard(user)
    })
  }))

  web.autoLoginHandler = (req, res, done) => {
    userAutoLoginService(req, res, uc).then(done, done)
  }

  web.router.post('/api/logout', toCallback(async (req, res) => {
    await userLogoutService(req, res)
    renderJson(res, {})
  }))

  const defaultErrorHandler = web.errorHandler

  web.errorHandler = (err, req, res, done) => {
    if (!res.locals.api) {
      if (err.name === NOT_AUTHENTICATED.name || err.name === NOT_AUTHORIZED.name) {
        res.redirect('/login')
        return
      }
    }
    defaultErrorHandler(err, req, res, done)
  }

}

export async function userLoginService(
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

async function userAutoLoginService(req: Request, res: Response, uc: UserCache) {
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
  const user = await userLoginService(req, res, uc, email, password, false, err)

  // 자동 로그인이 실패했다면
  if (!user) {
    res.clearCookie('email')
    res.clearCookie('password')
  }
}

export async function userLogoutService(req: Request, res: Response) {
  res.clearCookie('email')
  res.clearCookie('password')
  await new Promise<void>((resolve, reject) =>
    req.session.destroy(err => err ? reject(err) : resolve())
  )
}

export function getSessionUser(res: Response) {
  return res.locals.user as User
}


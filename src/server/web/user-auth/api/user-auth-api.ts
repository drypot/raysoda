import { Express2, toCallback } from '../../_express/express2'
import { Request, Response } from 'express'
import { GUEST, newUserIdCard, User } from '../../../_type/user'
import { newString } from '../../../_util/primitive'
import { ErrorConst } from '../../../_type/error'
import { checkHash } from '../../../_util/hash'
import { renderJson } from '../../_common/render-json'
import {
  ACCOUNT_DEACTIVATED,
  EMAIL_NOT_FOUND,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  PASSWORD_WRONG
} from '../../../_type/error-const'
import { omanGetObject } from '../../../oman/oman'
import { UserDB } from '../../../db/user/user-db'
import { UserLoginForm } from '../../../_type/user-form'

export async function useUserAuthApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.get('/api/login-info', toCallback(async function (req, res) {
    const user = getSessionUser(res)
    renderJson(res, {
      user: newUserIdCard(user)
    })
  }))

  web.router.post('/api/login', toCallback(async (req, res) => {
    const form: UserLoginForm = {
      email: newString(req.body.email).trim(),
      password: newString(req.body.password).trim(),
      remember: !!req.body.remember
    }
    const err: ErrorConst[] = []
    const user = await userLoginService(req, res, udb, form, err)
    if (!user || err.length) throw err
    renderJson(res, {
      user: newUserIdCard(user)
    })
  }))

  web.autoLoginHandler = (req, res, done) => {
    userAutoLoginService(req, res, udb).then(done, done)
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
  req: Request, res: Response, udb: UserDB, form: UserLoginForm, err: ErrorConst[]
) {

  let user = await udb.findUserByEmail(form.email)
  if (!user) {
    err.push(EMAIL_NOT_FOUND)
    return
  }
  if (user.status === 'd') {
    err.push(ACCOUNT_DEACTIVATED)
    return
  }
  if (!await checkHash(form.password, user.hash)) {
    err.push(PASSWORD_WRONG)
    return
  }

  await udb.updateADate(user.id, new Date())

  if (form.remember) {
    res.cookie('email', form.email, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
    res.cookie('password', form.password, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
  }

  await new Promise<void>((resolve, reject) =>
    req.session.regenerate(err => err ? reject(err) : resolve())
  )
  req.session.uid = String(user.id)

  // ADate 가 업데이트되서 케쉬가 날아간다.
  // 깨끗하게 다시 로딩하는 게 무난할 것 같다.
  user = await udb.getCachedById(user.id)
  res.locals.user = user

  return user

}

async function userAutoLoginService(req: Request, res: Response, udb: UserDB) {

  // 이미 로그인 되어있는 상태 라면
  if (req.session.uid) {
    const user = await udb.getCachedById(Number(req.session.uid)) as User
    res.locals.user = user
    return
  }

  // Guest 사용자 세팅
  res.locals.user = GUEST

  // 자동 로그인을 위한 쿠키 세팅이 없다면
  if (!req.cookies.email || !req.cookies.password) {
    return
  }

  // 자동 로그인 시도
  const form: UserLoginForm = {
    email: req.cookies.email,
    password: req.cookies.password,
    remember: false
  }
  const err: ErrorConst[] = []
  const user = await userLoginService(req, res, udb, form, err)

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
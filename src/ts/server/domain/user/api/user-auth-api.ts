import { GUEST, newUserIdCard, User } from '@common/type/user'
import {
  ACCOUNT_DEACTIVATED,
  EMAIL_NOT_FOUND,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  PASSWORD_WRONG
} from '@common/type/error-const'
import { Express2, toCallback } from '@server/express/express2'
import { checkHash } from '@common/util/hash'
import { UserLoginForm } from '@common/type/user-form'
import { newString } from '@common/util/primitive'
import { ErrorConst } from '@common/type/error'
import { getObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { Request, Response } from 'express'
import { renderJson } from '@server/express/response'


export async function useUserAuthApi() {

  const web = await getObject('Express2') as Express2
  const udb = await getObject('UserDB') as UserDB

  web.router.get('/api/user-login-info', toCallback(async function (req, res) {
    const user = userGetSessionUser(res)
    renderJson(res, {
      user: newUserIdCard(user)
    })
  }))

  web.router.post('/api/user-login', toCallback(async (req, res) => {
    const form: UserLoginForm = {
      email: newString(req.body.email).trim(),
      password: newString(req.body.password).trim(),
      remember: !!req.body.remember
    }
    const err: ErrorConst[] = []
    const user = await userLogin(req, res, udb, form, err)
    if (!user || err.length) throw err
    renderJson(res, {
      user: newUserIdCard(user)
    })
  }))

  web.autoLoginHandler = (req, res, done) => {
    userAutoLogin(req, res, udb).then(done, done)
  }

  web.router.post('/api/user-logout', toCallback(async (req, res) => {
    await userLogout(req, res)
    renderJson(res, {})
  }))

  const defaultErrorHandler = web.errorHandler
  web.errorHandler = (err, req, res, done) => {
    if (!res.locals.api) {
      if (err.name === NOT_AUTHENTICATED.name || err.name === NOT_AUTHORIZED.name) {
        res.redirect('/user-login')
        return
      }
    }
    defaultErrorHandler(err, req, res, done)
  }
}

export async function userLogin(
  req: Request, res: Response, udb: UserDB, form: UserLoginForm, err: ErrorConst[]
) {

  let user = await udb.getUserByEmail(form.email)
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

  await udb.updateUserById(user.id, { adate: new Date() })

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

async function userAutoLogin(req: Request, res: Response, udb: UserDB) {

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
  const user = await userLogin(req, res, udb, form, err)

  // 자동 로그인이 실패했다면
  if (!user) {
    res.clearCookie('email')
    res.clearCookie('password')
  }
}

export async function userLogout(req: Request, res: Response) {
  res.clearCookie('email')
  res.clearCookie('password')
  await new Promise<void>((resolve, reject) =>
    req.session.destroy(err => err ? reject(err) : resolve())
  )
}

export function userGetSessionUser(res: Response) {
  return res.locals.user as User
}

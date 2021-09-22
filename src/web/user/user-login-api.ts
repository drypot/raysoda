import { UserDB } from '../../db/user/user-db.js'
import { Express2, toCallback } from '../_express/express2.js'
import { NextFunction, Request, Response } from 'express'
import {
  ACCOUNT_DEACTIVATED,
  EMAIL_NOT_FOUND,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  PASSWORD_WRONG
} from '../../service/user/form/user-form.js'
import { Error2 } from '../../lib/base/error2.js'
import { User } from '../../entity/user-entity.js'
import { checkHash } from '../../lib/base/hash.js'
import { stringFrom } from '../../lib/base/primitive.js'

export function registerUserLoginApi(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/api/user/login', toCallback(async function (req, res) {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    res.json({
      user: { id: user.id, name: user.name, home: user.home, admin: user.admin }
    })
  }))

  router.get('/api/user/admin-login', toCallback(async function (req, res) {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    if (!user.admin) throw NOT_AUTHORIZED
    res.json({
      user: { id: user.id, name: user.name, home: user.home, admin: user.admin }
    })
  }))

  router.get('/api/user/session-script', toCallback(async function (req, res) {
    const config = web.config
    const user = res.locals.user
    const script =
      `const _config = {}\n` +
      `_config.appName = '${config.appName}'\n` +
      `_config.appNamel = '${config.appNamel}'\n` +
      `_config.appDesc = '${config.appDesc}'\n` +
      `_config.mainUrl = '${config.mainUrl}'\n` +
      `_config.uploadUrl = '${config.uploadUrl}'\n` +
      `const _user = ` + (user ? JSON.stringify({ id: user.id, name: user.name, home: user.home }) : 'undefined') + '\n'
    res.type('.js')
    res.send(script)
  }))

  router.post('/api/user/login', toCallback(async (req, res) => {
    const email = stringFrom(req.body.email).trim()
    const password = stringFrom(req.body.password).trim()
    const remember = !!req.body.remember
    const err: Error2[] = []
    const user = await findUserByEmailPassword(email, password, err)
    if (err.length) throw err
    if (!user) throw new Error()
    await createSession(req, res, user)
    if (remember) {
      res.cookie('email', email, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
      res.cookie('password', password, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
    }
    res.json({
      user: { id: user.id, name: user.name, home: user.home, admin: user.admin }
    })
  }))

  web.autoLogin = toCallback(async (req, res) => {
    if (req.session.uid) {
      res.locals.user = await udb.getCachedById(Number(req.session.uid))
      return
    }
    const email = req.cookies.email
    const password = req.cookies.password
    if (!email || !password) return
    const err: Error2[] = []
    const user = await findUserByEmailPassword(email, password, err)
    if (!user) {
      res.clearCookie('email')
      res.clearCookie('password')
      return
    }
    await createSession(req, res, user)
  })

  router.post('/api/user/logout', toCallback(async (req, res) => {
    await logoutCurrentSession(req, res)
    res.json({})
  }))

  web.redirectToLogin = function (err: any, req: Request, res: Response, done: NextFunction) {
    if (!res.locals.api && (
      err.name === NOT_AUTHENTICATED.name ||
      err.name === NOT_AUTHORIZED.name
    )) {
      res.redirect('/user/login')
    } else {
      done(err)
    }
  }

  async function findUserByEmailPassword(email: string, password: string, err: Error2[]) {
    const user = await udb.getRecachedByEmail(email)
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
    return user
  }

  async function createSession(req: Request, res: Response, user: User) {
    await new Promise<void>((resolve, reject) =>
      req.session.regenerate(err => err ? reject(err) : resolve())
    )
    user.adate = new Date()
    await udb.updateUserADate(user.id, user.adate)
    req.session.uid = String(user.id)
    res.locals.user = user
  }

}

export function sessionUserFrom(res: Response) {
  return res.locals.user as User | undefined
}

export function hasUpdatePerm(op: User, id: number) {
  return op.id === id || op.admin
}

export async function logoutCurrentSession(req: Request, res: Response) {
  res.clearCookie('email')
  res.clearCookie('password')
  await new Promise<void>((resolve, reject) =>
    req.session.destroy(err => err ? reject(err) : resolve())
  )
}

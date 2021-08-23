import { MSG_USER_NOT_FOUND, UserDB } from '../../../db/user/user-db.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { NextFunction, Request, Response } from 'express'
import {
  ACCOUNT_DEACTIVATED,
  EMAIL_NOT_FOUND,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  PASSWORD_WRONG
} from '../../../service/user/form/user-form.js'
import { FormError } from '../../../lib/base/error2.js'
import { User } from '../../../service/user/entity/user-entity.js'
import { checkHash } from '../../../lib/base/hash.js'

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

  router.post('/api/user/login', toCallback(async (req, res) => {
    const email = String(req.body.email || '').trim()
    const password = String(req.body.password || '').trim()
    const remember = !!req.body.remember
    const errs: FormError[] = []
    const user = await findUserByEmailPassword(email, password, errs)
    if (errs.length) throw errs
    if (!user) throw new Error(MSG_USER_NOT_FOUND)
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
    const errs: FormError[] = []
    const user = await findUserByEmailPassword(email, password, errs)
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

  async function findUserByEmailPassword(email: string, password: string, errs: FormError[]) {
    const user = await udb.getRecachedByEmail(email)
    if (!user) {
      errs.push(EMAIL_NOT_FOUND)
      return
    }
    if (user.status === 'd') {
      errs.push(ACCOUNT_DEACTIVATED)
      return
    }
    if (!await checkHash(password, user.hash)) {
      errs.push(PASSWORD_WRONG)
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

export function userCanUpdate(op: User, id: number) {
  return op.id === id || op.admin
}

export async function logoutCurrentSession(req: Request, res: Response) {
  res.clearCookie('email')
  res.clearCookie('password')
  await new Promise<void>((resolve, reject) =>
    req.session.destroy(err => err ? reject(err) : resolve())
  )
}

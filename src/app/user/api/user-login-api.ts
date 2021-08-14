import { MSG_USER_UNDEFINED, UserDB } from '../db/user-db.js'
import { Express2, toCallback } from '../../../lib/express/express2.js'
import { NextFunction, Request, Response } from 'express'
import {
  ACCOUNT_DEACTIVATED,
  EMAIL_NOT_FOUND,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  PASSWORD_WRONG
} from '../form/user-form.js'
import { FormError } from '../../../lib/base/error2.js'
import { User } from '../entity/user-entity.js'
import { checkPasswordHash } from '../entity/user-password.js'

export function initUserLoginApi(udb: UserDB, web: Express2) {

  const router = web.router

  // Pages

  router.get('/user/login', (req, res) => {
    res.render('app/user/view/user-login')
  })

  // Api

  router.get('/api/user/login', toCallback(async function (req, res) {
    const user = getSessionUser(res)
    if (!user) throw NOT_AUTHENTICATED
    res.json({
      user: { id: user.id, name: user.name }
    })
  }))

  router.get('/api/user/login-admin', toCallback(async function (req, res) {
    const user = getSessionUser(res)
    if (!user) throw NOT_AUTHENTICATED
    if (!user.admin) throw NOT_AUTHORIZED
    res.json({
      user: { id: user.id, name: user.name }
    })
  }))

  router.post('/api/user/login', toCallback(async (req, res) => {
    const email = String(req.body.email || '').trim()
    const password = String(req.body.password || '').trim()
    const remember = !!req.body.remember
    const errs = [] as FormError[]
    const user = await findUserByEmailPassword(email, password, errs)
    if (errs.length) throw errs
    if (!user) throw new Error(MSG_USER_UNDEFINED)
    await createSession(req, res, user)
    if (remember) {
      res.cookie('email', email, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
      res.cookie('password', password, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
    }
    res.json({
      user: {
        id: user.id,
        name: user.name
      }
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
    const errs = [] as FormError[]
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
    if (!res.locals.api && err.name === NOT_AUTHENTICATED.name) {
      res.redirect('/user/login')
    } else {
      done(err)
    }
  }

  async function findUserByEmailPassword(email: string, password: string, errs: FormError[]) {
    const user = await udb.getCachedByIdByEmail(email)
    if (!user) {
      errs.push(EMAIL_NOT_FOUND)
      return
    }
    if (user.status === 'd') {
      errs.push(ACCOUNT_DEACTIVATED)
      return
    }
    if (!await checkPasswordHash(password, user.hash)) {
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

export function getSessionUser(res: Response) {
  return res.locals.user as User | undefined
}

export function hasPermToUpdate(op: User, id: number) {
  return op.id === id || op.admin
}

export async function logoutCurrentSession(req: Request, res: Response) {
  res.clearCookie('email')
  res.clearCookie('password')
  await new Promise<void>((resolve, reject) =>
    req.session.destroy(err => err ? reject(err) : resolve())
  )
}

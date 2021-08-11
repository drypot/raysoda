import { UserDB } from '../db/user-db.js'
import { Express2, toCallback } from '../../../lib/express/express2.js'
import { checkPasswordHash } from '../service/user-service.js'
import { NextFunction, Request, Response } from 'express'
import {
  ACCOUNT_DEACTIVATED,
  EMAIL_NOT_FOUND,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  PASSWORD_WRONG
} from '../form/user-form.js'
import { UserCache } from '../cache/user-cache.js'
import { FormError } from '../../../lib/base/error2.js'
import { User } from '../entity/user-entity.js'

export function initUserAuthAPI(udb: UserDB, uc: UserCache, web: Express2) {

  const router = web.router

  router.get('/user/login', (req, res) => {
    res.render('app/user/view/user-login')
  })

  router.post('/api/user/login', toCallback(async (req, res) => {
    const email = String(req.body.email || '').trim()
    const password = String(req.body.password || '').trim()
    const remember = !!req.body.remember

    const errs = [] as FormError[]
    const user = await checkUserLogin(uc, email, password, errs)
    if (!user) throw errs

    if (remember) setCookie(res, email, password)
    await createSession(udb, req, res, user)

    res.json({
      user: {
        id: user.id,
        name: user.name
      }
    })
  }))

  async function checkUserLogin(uc: UserCache, email: string, password: string, errs: FormError[]) {
    const user = await uc.getCachedByEmail(email)
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

  function setCookie(res: Response, email: string, password: string) {
    res.cookie('email', email, {
      maxAge: 99 * 365 * 24 * 60 * 60 * 1000,
      httpOnly: true
    })
    res.cookie('password', password, {
      maxAge: 99 * 365 * 24 * 60 * 60 * 1000,
      httpOnly: true
    })
  }

  async function createSession(udb: UserDB, req: Request, res: Response, user: User) {
    await regenerateSession(req)
    const now = new Date()
    await udb.updateUserADate(user.id, now)
    user.adate = now
    req.session.uid = String(user.id)
    res.locals.user = user
  }

  function regenerateSession(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  router.get('/api/user/login', toCallback(async function (req, res) {
    const user = getSessionUser(res)
    res.json({
      user: {
        id: user.id,
        name: user.name
      }
    })
  }))

  router.post('/api/user/logout', toCallback(async (req, res) => {
    await logout(req, res)
    res.json({})
  }))

  web.autoLogin = toCallback(async (req, res) => {
    if (req.session.uid) {
      res.locals.user = await uc.getCached(Number(req.session.uid))
      return
    }

    const email = req.cookies.email
    const password = req.cookies.password
    if (!email || !password) return

    const errs = [] as FormError[]
    const user = await checkUserLogin(uc, email, password, errs)
    if (!user) {
      res.clearCookie('email')
      res.clearCookie('password')
      return
    }
    await createSession(udb, req, res, user)
  })


  web.redirectToLogin = function (err: any, req: Request, res: Response, done: NextFunction) {
    if (!res.locals.api && err.name === NOT_AUTHENTICATED.name) {
      res.redirect('/user/login')
    } else {
      done(err)
    }
  }

}

export function getSessionUser(res: Response) {
  const user = res.locals.user as User | undefined
  if (!user) throw NOT_AUTHENTICATED
  return user
}

export function getSessionAdmin(res: Response) {
  const user = res.locals.user as User | undefined
  if (!user) throw NOT_AUTHENTICATED
  if (!user.admin) throw NOT_AUTHORIZED
  return user
}

export function assertUpdatable(user: User, id: number) {
  if (user.id !== id && !user.admin) throw NOT_AUTHORIZED
}

export function logout(req: Request, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    res.clearCookie('email')
    res.clearCookie('password')
    req.session.destroy((err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

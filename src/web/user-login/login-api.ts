import { Express2, toCallback } from '../_express/express2.js'
import { NextFunction, Request, Response } from 'express'
import { Error2 } from '../../_util/error2.js'
import { User, userMinOf } from '../../_type/user.js'
import { checkHash } from '../../_util/hash.js'
import { stringFrom } from '../../_util/primitive.js'
import {
  ACCOUNT_DEACTIVATED,
  EMAIL_NOT_FOUND,
  NOT_AUTHENTICATED,
  NOT_AUTHORIZED,
  PASSWORD_WRONG
} from '../../_type/error-user.js'
import { UserCache } from '../../db/user/user-cache.js'

declare module 'express-session' {
  interface SessionData {
    uid: string
  }
}

// declare module '../_express/express2.js' {
//   interface ExpressLocals {
//     user: SessionUser | undefined
//   }
// }

export function registerLoginApi(web: Express2, uc: UserCache) {

  const router = web.router

  router.get('/api/session-user', toCallback(async function (req, res) {
    const suser = sessionUserFrom(res)
    if (!suser) throw NOT_AUTHENTICATED
    res.json({
      user: userMinOf(suser)
    })
  }))

  router.get('/api/session-user-as-admin', toCallback(async function (req, res) {
    const suser = sessionUserFrom(res)
    if (!suser) throw NOT_AUTHENTICATED
    if (!suser.admin) throw NOT_AUTHORIZED
    res.json({
      user: userMinOf(suser)
    })
  }))

  router.post('/api/login', toCallback(async (req, res) => {
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
      user: userMinOf(user)
    })
  }))

  web.autoLogin = toCallback(async (req, res) => {
    if (req.session.uid) {
      res.locals.user = await uc.getCachedById(Number(req.session.uid))
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

  router.post('/api/logout', toCallback(async (req, res) => {
    await logoutCurrentSession(req, res)
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

  async function findUserByEmailPassword(email: string, password: string, err: Error2[]) {
    const user = await uc.getRecachedByEmail(email)
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
    await uc.udb.updateUserADate(user.id, user.adate)
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

import { Express2, toCallback } from '../../_express/express2.js'
import { NextFunction, Request, Response } from 'express'
import { newUser, User } from '../../../_type/user.js'
import { checkHash } from '../../../_util/hash.js'
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
import { newSessionUser } from '../../../_type/user-session.js'

const guest = newUser({ id: -1, name: 'guest' })

export function registerLoginApi(web: Express2, uc: UserCache) {
  const router = web.router

  router.post('/api/login', toCallback(async (req, res) => {
    const email = newString(req.body.email).trim()
    const password = newString(req.body.password).trim()
    const remember = !!req.body.remember
    const err: ErrorConst[] = []
    const user = await findUserByEmailPassword(email, password, err)
    if (!user || err.length) throw err
    if (remember) {
      res.cookie('email', email, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
      res.cookie('password', password, { maxAge: 99 * 365 * 24 * 60 * 60 * 1000, httpOnly: true })
    }
    await updateUserStatus(user)
    await createSession(req, user)
    setLocalsUser(res, user)
    res.json({
      user: newSessionUser(user)
    })
  }))

  async function findUserByEmailPassword(email: string, password: string, err: ErrorConst[]) {
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
    return user
  }

  async function updateUserStatus(user: User) {
    user.adate = new Date()
    await uc.udb.updateADate(user.id, user.adate)
  }

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
    if (req.session.uid) {
      const user = await uc.getCachedById(Number(req.session.uid)) as User
      setLocalsUser(res, user)
      return
    }
    const email = req.cookies.email
    const password = req.cookies.password
    if (email && password) {
      const err: ErrorConst[] = []
      const user = await findUserByEmailPassword(email, password, err)
      if (user) {
        await updateUserStatus(user)
        await createSession(req, user)
        setLocalsUser(res, user)
        return
      }
      res.clearCookie('email')
      res.clearCookie('password')
    }
    setLocalsUser(res, guest)
  })

  router.get('/api/login-info', toCallback(async function (req, res) {
    const user = getUser(res)
    shouldBeUser(user)
    res.json({
      user: newSessionUser(user)
    })
  }))

  router.get('/api/login-info-admin', toCallback(async function (req, res) {
    const user = getUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    res.json({
      user: newSessionUser(user)
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
  if (user.id === -1) throw NOT_AUTHENTICATED
}

export function shouldBeAdmin(user: User) {
  if (!user.admin) throw NOT_AUTHORIZED
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

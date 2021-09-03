import { UserDB } from '../../db/user/user-db.js'
import { Express2, toCallback } from '../_express/express2.js'
import { hasUpdatePerm, sessionUserFrom } from './user-login-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED, UserUpdateForm } from '../../service/user/form/user-form.js'
import { Error2 } from '../../lib/base/error2.js'
import { userUpdateService } from '../../service/user/user-update-service.js'
import { Request } from 'express'

export function userUpdateFormFrom(req: Request) {
  const body = req.body
  return {
    name: String(body.name ?? '').trim(),
    home: String(body.home ?? '').trim(),
    email: String(body.email ?? '').trim(),
    password: String(body.password ?? '').trim(),
    profile: String(body.profile ?? '').trim(),
  } as UserUpdateForm
}

export function registerUserUpdateApi(web: Express2, udb: UserDB) {

  const router = web.router

  router.put('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = parseInt(req.params.id) || 0
    if (!hasUpdatePerm(user, id)) throw NOT_AUTHORIZED
    const form = userUpdateFormFrom(req)
    const err: Error2[] = []
    await userUpdateService(udb, id, form, err)
    if (err.length) throw err
    res.json({})
  }))

}

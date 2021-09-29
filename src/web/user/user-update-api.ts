import { UserDB } from '../../db/user/user-db.js'
import { Express2, toCallback } from '../_express/express2.js'
import { hasUpdatePerm, sessionUserFrom } from '../user-login/login-api.js'
import { UserUpdateForm } from '../../service/user/_user-service.js'
import { Error2 } from '../../_error/error2.js'
import { userUpdateService } from '../../service/user/user-update-service.js'
import { Request } from 'express'
import { numberFrom, stringFrom } from '../../_util/primitive.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../_error/error-user.js'

export function userUpdateFormFrom(req: Request) {
  const body = req.body
  return {
    name: stringFrom(body.name).trim(),
    home: stringFrom(body.home).trim(),
    email: stringFrom(body.email).trim(),
    password: stringFrom(body.password).trim(),
    profile: stringFrom(body.profile).trim(),
  } as UserUpdateForm
}

export function registerUserUpdateApi(web: Express2, udb: UserDB) {

  const router = web.router

  router.put('/api/user-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = numberFrom(req.params.id)
    if (!hasUpdatePerm(user, id)) throw NOT_AUTHORIZED
    const form = userUpdateFormFrom(req)
    const err: Error2[] = []
    await userUpdateService(udb, id, form, err)
    if (err.length) throw err
    res.json({})
  }))

}

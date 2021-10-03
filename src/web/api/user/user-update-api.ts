import { Express2, toCallback } from '../../_express/express2.js'
import { userUpdateService } from '../../../service/user/user-update-service.js'
import { Request } from 'express'
import { newNumber, newString } from '../../../_util/primitive.js'
import { NOT_AUTHORIZED } from '../../../_type/error-user.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'
import { UserUpdateForm } from '../../../_type/user-form.js'
import { getSessionUser, hasUpdatePerm, shouldBeUser } from '../user-login/login-api.js'

export function newUserUpdateForm(req: Request): UserUpdateForm {
  const body = req.body
  return {
    name: newString(body.name).trim(),
    home: newString(body.home).trim(),
    email: newString(body.email).trim(),
    password: newString(body.password).trim(),
    profile: newString(body.profile).trim(),
  }
}

export function registerUserUpdateApi(web: Express2, uc: UserCache) {

  web.router.put('/api/user-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    if (!hasUpdatePerm(user, id)) throw NOT_AUTHORIZED
    const form = newUserUpdateForm(req)
    const err: ErrorConst[] = []
    await userUpdateService(uc, id, form, err)
    if (err.length) throw err
    res.json({})
  }))

}

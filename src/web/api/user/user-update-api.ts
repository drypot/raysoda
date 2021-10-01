import { Express2, toCallback } from '../../_express/express2.js'
import { hasUpdatePerm, loginUserFrom } from '../user-login/login-api.js'
import { UserUpdateForm } from '../../../service/user/_user-service.js'
import { userUpdateService } from '../../../service/user/user-update-service.js'
import { Request } from 'express'
import { paramToNumber, paramToString } from '../../../_util/param.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../_type/error-user.js'
import { UserCache } from '../../../db/user/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'

export function userUpdateFormFrom(req: Request): UserUpdateForm {
  const body = req.body
  return {
    name: paramToString(body.name).trim(),
    home: paramToString(body.home).trim(),
    email: paramToString(body.email).trim(),
    password: paramToString(body.password).trim(),
    profile: paramToString(body.profile).trim(),
  }
}

export function registerUserUpdateApi(web: Express2, uc: UserCache) {

  const router = web.router

  router.put('/api/user-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = loginUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = paramToNumber(req.params.id)
    if (!hasUpdatePerm(user, id)) throw NOT_AUTHORIZED
    const form = userUpdateFormFrom(req)
    const err: ErrorConst[] = []
    await userUpdateService(uc, id, form, err)
    if (err.length) throw err
    res.json({})
  }))

}

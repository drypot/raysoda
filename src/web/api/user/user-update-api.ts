import { Express2, toCallback } from '../../_express/express2.js'
import { userUpdateGetService, userUpdateService } from '../../../service/user/user-update-service.js'
import { Request } from 'express'
import { newNumber, newString } from '../../../_util/primitive.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'
import { UserUpdateForm } from '../../../_type/user-form.js'
import { getSessionUser, shouldBeUser } from '../user-login/login-api.js'
import { renderJson } from '../_common/render-json.js'

export function registerUserUpdateApi(web: Express2, uc: UserCache) {

  web.router.get('/api/user-update-get/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const user2 = await userUpdateGetService(uc, user, id, err)
    if (!user2 || err.length) throw err
    renderJson(res, { user: user2 })
  }))

  web.router.put('/api/user-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const form = newUpdateForm(req)
    const err: ErrorConst[] = []
    await userUpdateService(uc, user, id, form, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}

function newUpdateForm(req: Request): UserUpdateForm {
  const body = req.body
  return {
    name: newString(body.name).trim(),
    home: newString(body.home).trim(),
    email: newString(body.email).trim(),
    password: newString(body.password).trim(),
    profile: newString(body.profile).trim(),
  }
}

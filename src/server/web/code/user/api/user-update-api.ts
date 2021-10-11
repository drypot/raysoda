import { Express2, toCallback } from '../../../_express/express2'
import { userUpdateGetService, userUpdateService } from '../../../../service/user/user-update-service'
import { Request } from 'express'
import { newNumber, newString } from '../../../../_util/primitive'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { ErrorConst } from '../../../../_type/error'
import { UserUpdateForm } from '../../../../_type/user-form'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { renderJson } from '../../_common/render-json'
import { shouldBeUser } from '../../../../service/user-auth/user-auth-service'

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

import { newNumber, newString } from '@common/util/primitive'
import { Express2, toCallback } from '@server/web/_express/express2'
import { UserUpdateForm } from '@common/type/user-form'
import { ErrorConst } from '@common/type/error'
import { getSessionUser } from '@server/web/user-auth/api/user-auth-api'
import { userUpdateGetService, userUpdateService } from '@server/service/user/user-update-service'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/web/_common/render-json'
import { shouldBeUser } from '@server/service/user-auth/user-auth-service'
import { Request } from 'express'

export async function useUserUpdateApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.get('/api/user-update-get/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const user2 = await userUpdateGetService(udb, user, id, err)
    if (!user2 || err.length) throw err
    renderJson(res, { user: user2 })
  }))

  web.router.put('/api/user-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const form = newUpdateForm(req)
    const err: ErrorConst[] = []
    await userUpdateService(udb, user, id, form, err)
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

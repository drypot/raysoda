import { newNumber, newString } from '@common/util/primitive'
import { Express2, toCallback } from '@server/express/express2'
import { UserUpdateForm } from '@common/type/user-form'
import { ErrorConst } from '@common/type/error'
import { userGetSessionUser, userLogout } from '@server/domain/user/api/user-auth-api'
import { userGetForUpdate, userUpdate, userUpdateStatus } from '@server/domain/user/_service/user-update'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/express/render-json'
import { userAssertLogin } from '@server/domain/user/_service/user-auth'
import { Request } from 'express'

export async function useUserUpdateApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.get('/api/user-update-get/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const user2 = await userGetForUpdate(udb, user, id, err)
    if (!user2 || err.length) throw err
    renderJson(res, { user: user2 })
  }))

  web.router.put('/api/user-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    const id = newNumber(req.params.id)
    const form = newUpdateForm(req)
    const err: ErrorConst[] = []
    await userUpdate(udb, user, id, form, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

  web.router.put('/api/user-update-status/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    const id = newNumber(req.params.id)
    const status = newString(req.body.status)
    const err: ErrorConst[] = []
    await userUpdateStatus(udb, user, id, status, err)
    if (err.length) throw err
    if (user.id === id) {
      await userLogout(req, res)
    }
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

import { newNumber, newString } from '@common/util/primitive'
import { Express2, toCallback } from '@server/express/express2'
import { UserUpdatePasswordForm, UserUpdateProfileForm, UserUpdateStatusForm } from '@common/type/user-form'
import { ErrorConst } from '@common/type/error'
import { userGetSessionUser, userLogout } from '@server/domain/user/api/user-auth-api'
import {
  userUpdatePassword,
  userUpdateProfile,
  userUpdateProfileGet,
  userUpdateStatus
} from '@server/domain/user/_service/user-update'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/express/render-json'
import { userAssertLogin } from '@server/domain/user/_service/user-auth'

export async function useUserUpdateApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.get('/api/user-update-profile-get/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)

    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const user2 = await userUpdateProfileGet(udb, user, id, err)
    if (!user2 || err.length) throw err

    renderJson(res, { user: user2 })
  }))

  web.router.put('/api/user-update-profile', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)

    const body = req.body
    const form: UserUpdateProfileForm = {
        id: newNumber(body.id),
        name: newString(body.name).trim(),
        home: newString(body.home).trim(),
        email: newString(body.email).trim(),
        profile: newString(body.profile).trim(),
    }
    const err: ErrorConst[] = []
    await userUpdateProfile(udb, user, form, err)
    if (err.length) throw err

    renderJson(res, {})
  }))

  web.router.put('/api/user-update-password', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)

    const body = req.body
    const form: UserUpdatePasswordForm = {
        id: newNumber(body.id),
        password: newString(body.password).trim()
    }
    const err: ErrorConst[] = []
    await userUpdatePassword(udb, user, form, err)
    if (err.length) throw err

    renderJson(res, {})
  }))

  web.router.put('/api/user-update-status', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)

    const body = req.body
    const form: UserUpdateStatusForm = {
      id: newNumber(body.id),
      status: newString(body.status) === 'v' ? 'v' : 'd'
    }
    const err: ErrorConst[] = []
    await userUpdateStatus(udb, user, form, err)
    if (err.length) throw err

    if (user.id === form.id) {
      await userLogout(req, res)
    }
    renderJson(res, {})
  }))

}


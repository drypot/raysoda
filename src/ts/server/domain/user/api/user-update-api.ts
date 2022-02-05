import { newNumber, newString } from '@common/util/primitive'
import { Express2, toCallback } from '@server/express/express2'
import { UpdateUserPasswordForm, UpdateUserProfileForm, UpdateUserStatusForm } from '@common/type/user-form'
import { ErrorConst } from '@common/type/error'
import { userGetSessionUser, userLogout } from '@server/domain/user/api/user-auth-api'
import {
  getUserForUpdateProfile,
  updateUserPassword,
  updateUserProfile,
  updateUserStatus
} from '@server/domain/user/_service/user-update'
import { getObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { assertLoggedIn } from '@server/domain/user/_service/user-auth'
import { renderJson } from '@server/express/response'

export async function useUserUpdateApi() {

  const web = await getObject('Express2') as Express2
  const udb = await getObject('UserDB') as UserDB

  web.router.get('/api/user-update-profile-get/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const user2 = await getUserForUpdateProfile(udb, user, id, err)
    if (!user2 || err.length) throw err

    renderJson(res, { user: user2 })
  }))

  web.router.put('/api/user-update-profile', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const body = req.body
    const form: UpdateUserProfileForm = {
        id: newNumber(body.id),
        name: newString(body.name).trim(),
        home: newString(body.home).trim(),
        email: newString(body.email).trim(),
        profile: newString(body.profile).trim(),
    }
    const err: ErrorConst[] = []
    await updateUserProfile(udb, user, form, err)
    if (err.length) throw err

    renderJson(res, {})
  }))

  web.router.put('/api/user-update-password', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const body = req.body
    const form: UpdateUserPasswordForm = {
        id: newNumber(body.id),
        password: newString(body.password).trim()
    }
    const err: ErrorConst[] = []
    await updateUserPassword(udb, user, form, err)
    if (err.length) throw err

    renderJson(res, {})
  }))

  web.router.put('/api/user-update-status', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const body = req.body
    const form: UpdateUserStatusForm = {
      id: newNumber(body.id),
      status: newString(body.status) === 'v' ? 'v' : 'd'
    }
    const err: ErrorConst[] = []
    await updateUserStatus(udb, user, form, err)
    if (err.length) throw err

    if (user.id === form.id) {
      await userLogout(req, res)
    }
    renderJson(res, {})
  }))

}


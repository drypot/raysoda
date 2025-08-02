import { getExpress2, toCallback } from '../../../express/express2.js'
import { getUserDB } from '../../../db/user/user-db.js'
import { userGetSessionUser, userLogout } from './user-auth-api.js'
import { assertLoggedIn } from '../service/user-auth.js'
import { newNumber, newString } from '../../../common/util/primitive.js'
import { ErrorConst } from '../../../common/type/error.js'
import {
  getUserForUpdateProfile,
  updateUserPassword,
  updateUserProfile,
  updateUserStatus
} from '../service/user-update.js'
import { renderJson } from '../../../express/response.js'
import { UpdateUserPasswordForm, UpdateUserProfileForm, UpdateUserStatusForm } from '../../../common/type/user-form.js'

export async function useUserUpdateApi() {

  const express2 = await getExpress2()
  const udb = await getUserDB()

  express2.router.get('/api/user-update-profile-get/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const user2 = await getUserForUpdateProfile(udb, user, id, err)
    if (!user2 || err.length) throw err

    renderJson(res, { user: user2 })
  }))

  express2.router.put('/api/user-update-profile', toCallback(async (req, res) => {
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

  express2.router.put('/api/user-update-password', toCallback(async (req, res) => {
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

  express2.router.put('/api/user-update-status', toCallback(async (req, res) => {
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


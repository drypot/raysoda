import { getExpress2, toCallback } from '../../../express/express2.js'
import { getUserDB } from '../../../db/user/user-db.js'
import { userGetSessionUser } from '../api/user-auth-api.js'
import { assertAdmin, assertLoggedIn } from '../service/user-auth.js'
import { newNumber } from '../../../common/util/primitive.js'
import { ErrorConst } from '../../../common/type/error.js'
import { getUserForUpdateProfile } from '../service/user-update.js'
import { getConfig } from '../../../oman/oman.js'
import { renderHtml } from '../../../express/response.js'

export async function useUserUpdatePage() {

  const express2 = await getExpress2()
  const udb = await getUserDB()

  express2.router.get('/user-update-profile/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const userForm = await getUserForUpdateProfile(udb, user, id, err)
    if (!userForm || err.length) throw err

    const config = getConfig()

    renderHtml(res, 'user/user-update-profile', {
      form: {
        mainUrl: config.mainUrl,
        user: userForm
      }
    })
  }))

  express2.router.get('/user-update-password/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    renderHtml(res, 'user/user-update-password')
  }))

  express2.router.get('/user-update-status/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    assertAdmin(user)

    const id = newNumber(req.params.id)
    const formUser = await udb.getCachedById(id)
    if (!formUser) throw new Error()

    renderHtml(res, 'user/user-update-status', { form: { status: formUser.status } })
  }))

  express2.router.get('/user-update-done/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const id = newNumber(req.params.id)
    const formUser = await udb.getCachedById(id)
    if (!formUser) throw new Error()

    renderHtml(res, 'user/user-update-done', { form: { home: formUser.home } })
  }))

}

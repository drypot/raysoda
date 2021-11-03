import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { userUpdateProfileGet } from '@server/domain/user/_service/user-update'
import { renderHtml } from '@server/express/render-html'
import { newNumber } from '@common/util/primitive'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { userAssertAdmin, userAssertLogin } from '@server/domain/user/_service/user-auth'

export async function useUserUpdatePage() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.get('/user-update-profile/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)

    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const formUser = await userUpdateProfileGet(udb, user, id, err)
    if (!formUser || err.length) throw err

    const config = omanGetConfig()

    renderHtml(res, 'user/user-update-profile', {
      form: {
        mainUrl: config.mainUrl,
        user: formUser
      }
    })
  }))

  web.router.get('/user-update-password/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    renderHtml(res, 'user/user-update-password')
  }))

  web.router.get('/user-update-status/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    userAssertAdmin(user)

    const id = newNumber(req.params.id)
    const formUser = await udb.getCachedById(id)
    if (!formUser) throw new Error()

    renderHtml(res, 'user/user-update-status', { form: { status: formUser.status } })
  }))

  web.router.get('/user-update-done/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)

    const id = newNumber(req.params.id)
    const formUser = await udb.getCachedById(id)
    if (!formUser) throw new Error()

    renderHtml(res, 'user/user-update-done', { form: { home: formUser.home } })
  }))

}

import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { userUpdateProfileGet } from '@server/domain/user/_service/user-update'
import { renderHtml } from '@server/express/render-html'
import { newNumber } from '@common/util/primitive'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { userAssertAdmin, userAssertLogin } from '@server/domain/user/_service/user-auth'

export async function useUserUpdatePage() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.get('/user-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)

    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const user2 = await userUpdateProfileGet(udb, user, id, err)
    if (!user2 || err.length) throw err

    renderHtml(res, 'user/user-update', { user2: user2 })
  }))

  web.router.get('/user-update-password/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    renderHtml(res, 'user/user-update-password')
  }))

  web.router.get('/user-update-password-done/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)

    const id = newNumber(req.params.id)
    const user2 = await udb.getCachedById(id)
    if (!user2) throw new Error()

    renderHtml(res, 'user/user-update-password-done', { user2: { home: user2.home } })
  }))

  web.router.get('/user-update-status/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    userAssertAdmin(user)

    const id = newNumber(req.params.id)
    const user2 = await udb.getCachedById(id)
    if (!user2) throw new Error()

    renderHtml(res, 'user/user-update-status', { user2: { status: user2.status }})
  }))

  web.router.get('/user-update-status-done/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    userAssertAdmin(user)

    const id = newNumber(req.params.id)
    const user2 = await udb.getCachedById(id)
    if (!user2) throw new Error()

    renderHtml(res, 'user/user-update-status-done', { user2: { home: user2.home } })
  }))

}

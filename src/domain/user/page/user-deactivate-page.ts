import { getExpress2, toCallback } from '../../../express/express2.js'
import { userGetSessionUser } from '../api/user-auth-api.js'
import { assertLoggedIn } from '../service/user-auth.js'
import { renderHtml } from '../../../express/response.js'

export async function useUserDeactivatePage() {

  const express2 = await getExpress2()

  express2.router.get('/user-deactivate', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    renderHtml(res, 'user/user-deactivate')
  }))

  express2.router.get('/user-deactivate-done', toCallback(async (req, res) => {
    renderHtml(res, 'user/user-deactivate-done')
  }))

}

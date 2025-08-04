import { getExpress2, toCallback } from '../../../express/express2.ts'
import { userGetSessionUser } from '../api/user-auth-api.ts'
import { assertLoggedIn } from '../service/user-auth.ts'
import { renderHtml } from '../../../express/response.ts'

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

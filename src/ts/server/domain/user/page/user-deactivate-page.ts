import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { renderHtml } from '@server/express/response'
import { getObject } from '@server/oman/oman'
import { assertLoggedIn } from '@server/domain/user/_service/user-auth'

export async function useUserDeactivatePage() {

  const web = await getObject('Express2') as Express2

  web.router.get('/user-deactivate', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    renderHtml(res, 'user/user-deactivate')
  }))

  web.router.get('/user-deactivate-done', toCallback(async (req, res) => {
    renderHtml(res, 'user/user-deactivate-done')
  }))

}

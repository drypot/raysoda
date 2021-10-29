import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { renderHtml } from '@server/express/render-html'
import { omanGetObject } from '@server/oman/oman'
import { userAssertLogin } from '@server/domain/user/_service/user-auth'

export async function useUserDeactivatePage() {

  const web = await omanGetObject('Express2') as Express2

  web.router.get('/user-deactivate', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    renderHtml(res, 'user/user-deactivate')
  }))

  web.router.get('/user-deactivate-done', toCallback(async (req, res) => {
    renderHtml(res, 'user/user-deactivate-done')
  }))

}

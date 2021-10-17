import { Express2, toCallback } from '@server/web/_express/express2'
import { getSessionUser } from '@server/web/user-auth/api/user-auth-api'
import { renderHtml } from '@server/web/_common/render-html'
import { omanGetObject } from '@server/oman/oman'
import { shouldBeUser } from '@server/service/user-auth/user-auth-service'

export async function useUserDeactivatePage() {

  const web = await omanGetObject('Express2') as Express2

  web.router.get('/user-deactivate', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    renderHtml(res, 'user/user-deactivate')
  }))

}

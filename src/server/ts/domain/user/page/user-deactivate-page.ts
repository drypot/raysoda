import { Express2, toCallback } from '@server/express/express2'
import { getSessionUser } from '@server/domain/user/api/user-auth-api'
import { renderHtml } from '@server/express/render-html'
import { omanGetObject } from '@server/oman/oman'
import { shouldBeUser } from '@server/domain/user/_service/user-auth-service'

export async function useUserDeactivatePage() {

  const web = await omanGetObject('Express2') as Express2

  web.router.get('/user-deactivate', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    renderHtml(res, 'user/user-deactivate')
  }))

}

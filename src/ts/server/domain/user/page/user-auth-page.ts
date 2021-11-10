import { omanGetObject } from '@server/oman/oman'
import { userLogout } from '@server/domain/user/api/user-auth-api'
import { Express2, toCallback } from '@server/express/express2'
import { renderHtml } from '@server/express/respose'

export async function useUserAuthPage() {

  const web = await omanGetObject('Express2') as Express2

  web.router.get('/user-login', (req, res) => {
    renderHtml(res, 'user/user-login')
  })

  web.router.get('/user-logout', toCallback(async (req, res) => {
    await userLogout(req, res)
    res.redirect('/')
  }))

}

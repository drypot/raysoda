import { omanGetObject } from '@server/oman/oman'
import { userLogoutService } from '@server/web/user-auth/api/user-auth-api'
import { Express2, toCallback } from '@server/web/_express/express2'
import { renderHtml } from '@server/web/_common/render-html'

export async function useUserAuthPage() {

  const web = await omanGetObject('Express2') as Express2

  web.router.get('/login', (req, res) => {
    renderHtml(res, 'user-auth/login')
  })

  web.router.get('/logout', toCallback(async (req, res) => {
    await userLogoutService(req, res)
    res.redirect('/')
  }))

}

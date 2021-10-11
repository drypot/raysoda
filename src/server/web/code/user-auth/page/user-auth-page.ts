import { Express2, toCallback } from '../../../_express/express2'
import { userLogoutService } from '../api/user-auth-api'
import { renderHtml } from '../../_common/render-html'

export function registerUserAuthPage(web: Express2) {

  web.router.get('/login', (req, res) => {
    renderHtml(res, 'user-auth/login')
  })

  web.router.get('/logout', toCallback(async (req, res) => {
    await userLogoutService(req, res)
    res.redirect('/')
  }))

}
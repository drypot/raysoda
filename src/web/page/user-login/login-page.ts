import { Express2, toCallback } from '../../_express/express2.js'
import { logoutService } from '../../api/user-login/login-api.js'
import { renderHtml } from '../_common/render-html.js'

export function registerLoginPage(web: Express2) {

  web.router.get('/login', (req, res) => {
    renderHtml(res, 'user-login/login')
  })

  web.router.get('/logout', toCallback(async (req, res) => {
    await logoutService(req, res)
    res.redirect('/')
  }))

}

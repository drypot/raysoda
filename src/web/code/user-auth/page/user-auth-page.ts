import { Express2, toCallback } from '../../../_express/express2.js'
import { userLogoutService } from '../api/user-auth-api.js'
import { renderHtml } from '../../_common/render-html.js'

export function registerUserAuthPage(web: Express2) {

  web.router.get('/login', (req, res) => {
    renderHtml(res, 'user-login/login')
  })

  web.router.get('/logout', toCallback(async (req, res) => {
    await userLogoutService(req, res)
    res.redirect('/')
  }))

}

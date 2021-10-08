import { Express2, toCallback } from '../../_express/express2.js'
import { getSessionUser, shouldBeUser } from '../../api/user-login/login-api.js'
import { renderHtml } from '../_page/page.js'

export function registerUserDeactivatePage(web: Express2) {

  web.router.get('/user-deactivate', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    renderHtml(res, 'user/user-deactivate')
  }))

}

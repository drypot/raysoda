import { Express2, toCallback } from '../../../_express/express2'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { renderHtml } from '../../_common/render-html'
import { shouldBeUser } from '../../../../service/user-auth/user-auth-service'

export function registerUserDeactivatePage(web: Express2) {

  web.router.get('/user-deactivate', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    renderHtml(res, 'user/user-deactivate')
  }))

}

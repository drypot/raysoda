import { Express2, toCallback } from '../_express/express2.js'
import { sessionUserFrom } from '../user/user-login-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../_error/error-user.js'

export function registerCounterPage(web: Express2) {

  web.router.get('/counter-list', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    if (!user.admin) throw NOT_AUTHORIZED
    res.render('counter/pug/counter-list')
  }))

}

import { Express2, toCallback } from '../../_express/express2.js'
import { sessionUserFrom } from '../../api/user-login/login-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../_type/error-user.js'

export function registerCounterPage(web: Express2) {

  web.router.get('/counter', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    if (!user.admin) throw NOT_AUTHORIZED
    res.render('counter/counter')
  }))

}

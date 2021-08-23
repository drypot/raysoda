import { Express2, toCallback } from '../lib/express/express2.js'
import { sessionUserFrom } from '../user/case/login/user-login-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../user/case/register-form/user-form.js'

export function registerCounterView(web: Express2) {

  web.router.get('/support/counter', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    if (!user.admin) throw NOT_AUTHORIZED
    res.render('counter/counter-view')
  }))

}

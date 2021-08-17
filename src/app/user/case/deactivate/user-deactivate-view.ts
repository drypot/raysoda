import { UserDB } from '../../db/user-db.js'
import { Express2, toCallback } from '../../../../lib/express/express2.js'
import { NOT_AUTHENTICATED } from '../register-form/user-form.js'
import { sessionUserFrom } from '../login/user-login-api.js'

export function registerUserDeactivateView(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/user/deactivate', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    res.render('app/user/case/deactivate/user-deactivate-view')
  }))

}

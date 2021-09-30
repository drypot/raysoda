import { UserDB } from '../../../db/user/user-db.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { sessionUserFrom } from '../../api/user-login/login-api.js'
import { NOT_AUTHENTICATED } from '../../../_type/error-user.js'

export function registerUserDeactivatePage(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/user-deactivate', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    res.render('user/user-deactivate')
  }))

}

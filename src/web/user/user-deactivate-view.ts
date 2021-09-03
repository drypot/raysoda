import { UserDB } from '../../db/user/user-db.js'
import { Express2, toCallback } from '../_express/express2.js'
import { NOT_AUTHENTICATED } from '../../service/user/form/user-form.js'
import { sessionUserFrom } from './user-login-api.js'

export function registerUserDeactivateView(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/user/deactivate', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    res.render('user/pug/user-deactivate-view')
  }))

}

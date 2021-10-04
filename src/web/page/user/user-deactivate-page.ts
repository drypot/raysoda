import { UserDB } from '../../../db/user/user-db.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { getSessionUser, shouldBeUser } from '../../api/user-login/login-api.js'

export function registerUserDeactivatePage(web: Express2, udb: UserDB) {

  web.router.get('/user-deactivate', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    res.render('user/user-deactivate')
  }))

}

import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'

export function registerUserLoginView(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/user/login', (req, res) => {
    res.render('user/user-login-view')
  })

}

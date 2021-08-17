import { UserDB } from '../../db/user-db.js'
import { Express2 } from '../../../../lib/express/express2.js'

export function registerUserLoginView(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/user/login', (req, res) => {
    res.render('app/user/case/login/user-login-view')
  })

}

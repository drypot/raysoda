import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'

export function registerLoginPage(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/login', (req, res) => {
    res.render('user-login/login')
  })

}

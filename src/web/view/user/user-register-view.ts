import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'

export function registerUserRegisterView(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/user/register', (req, res) => {
    res.render('user/user-register-view')
  })

  router.get('/user/register-done', (req, res) => {
    res.render('user/user-register-view-done')
  })

}

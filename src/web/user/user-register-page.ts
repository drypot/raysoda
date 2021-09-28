import { UserDB } from '../../db/user/user-db.js'
import { Express2 } from '../_express/express2.js'

export function registerUserRegisterPage(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/user-register', (req, res) => {
    res.render('user/pug/user-register')
  })

  router.get('/user-register-done', (req, res) => {
    res.render('user/pug/user-register-done')
  })

}

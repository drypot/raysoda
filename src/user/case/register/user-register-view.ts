import { UserDB } from '../../db/user-db.js'
import { Express2 } from '../../../lib/express/express2.js'

export function registerUserRegisterView(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/user/register', (req, res) => {
    res.render('user/case/register/user-register-view')
  })

  router.get('/user/register-done', (req, res) => {
    res.render('user/case/register/user-register-view-done')
  })

}

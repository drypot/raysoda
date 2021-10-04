import { Express2 } from '../../_express/express2.js'

export function registerUserRegisterPage(web: Express2) {

  web.router.get('/user-register', (req, res) => {
    res.render('user/user-register')
  })

  web.router.get('/user-register-done', (req, res) => {
    res.render('user/user-register-done')
  })

}

import { Express2 } from '../../_express/express2.js'

export function registerLoginPage(web: Express2) {

  web.router.get('/login', (req, res) => {
    res.render('user-login/login')
  })

}

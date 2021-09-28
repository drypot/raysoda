import { Express2 } from '../_express/express2.js'

export function registerUserPwResetPage(web: Express2) {

  const router = web.router

  router.get('/user-password-reset', function (req, res, done) {
    res.render('user/pug/user-pwreset1')
  })

  router.get('/user-password-reset-2', function (req, res, done) {
    res.render('user/pug/user-pwreset2')
  })

  router.get('/user-password-reset-3', function (req, res, done) {
    res.render('user/pug/user-pwreset3')
  })

}

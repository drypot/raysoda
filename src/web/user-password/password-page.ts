import { Express2 } from '../_express/express2.js'

export function registerPasswordPage(web: Express2) {

  const router = web.router

  router.get('/password-reset', function (req, res, done) {
    res.render('user-password/pug/password-reset-1')
  })

  router.get('/password-reset-2', function (req, res, done) {
    res.render('user-password/pug/password-reset-2')
  })

  router.get('/password-reset-3', function (req, res, done) {
    res.render('user-password/pug/password-reset-3')
  })

}

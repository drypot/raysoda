import { Express2 } from '../../_express/express2.js'

export function registerPwResetView(web: Express2) {

  const router = web.router

  router.get('/user/password-reset', function (req, res, done) {
    res.render('user/pwreset-view-1')
  })

  router.get('/user/password-reset-2', function (req, res, done) {
    res.render('user/pwreset-view-2')
  })

  router.get('/user/password-reset-3', function (req, res, done) {
    res.render('user/pwreset-view-3')
  })

}

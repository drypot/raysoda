import { Express2, renderHtml } from '../../_express/express2.js'

export function registerPasswordPage(web: Express2) {

  web.router.get('/password-reset', function (req, res, done) {
    renderHtml(res, 'user-password/password-reset-1')
  })

  web.router.get('/password-reset-2', function (req, res, done) {
    renderHtml(res, 'user-password/password-reset-2')
  })

  web.router.get('/password-reset-3', function (req, res, done) {
    renderHtml(res, 'user-password/password-reset-3')
  })

}

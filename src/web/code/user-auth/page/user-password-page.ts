import { Express2 } from '../../../_express/express2.js'
import { renderHtml } from '../../_common/render-html.js'

export function registerUserPasswordPage(web: Express2) {

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

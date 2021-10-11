import { Express2 } from '../../../_express/express2'
import { renderHtml } from '../../_common/render-html'

export function registerUserPasswordPage(web: Express2) {

  web.router.get('/user-password-reset', function (req, res, done) {
    renderHtml(res, 'user-auth/user-password-reset-1')
  })

  web.router.get('/user-password-reset-2', function (req, res, done) {
    renderHtml(res, 'user-auth/user-password-reset-2')
  })

  web.router.get('/user-password-reset-3', function (req, res, done) {
    renderHtml(res, 'user-auth/user-password-reset-3')
  })

}

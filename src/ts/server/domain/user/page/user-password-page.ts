import { omanGetObject } from '@server/oman/oman'
import { Express2 } from '@server/express/express2'
import { renderHtml } from '@server/express/render-html'

export async function useUserPwResetPage() {

  const web = await omanGetObject('Express2') as Express2

  web.router.get('/user-password-mail', function (req, res, done) {
    renderHtml(res, 'user/user-password-mail')
  })

  web.router.get('/user-password-mail-done', function (req, res, done) {
    renderHtml(res, 'user/user-password-mail-done')
  })

  web.router.get('/user-password-reset/:id/:random', function (req, res, done) {
    renderHtml(res, 'user/user-password-reset')
  })

  web.router.get('/user-password-reset-done', function (req, res, done) {
    renderHtml(res, 'user/user-password-reset-done')
  })

}

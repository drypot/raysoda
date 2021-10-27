import { omanGetObject } from '@server/oman/oman'
import { Express2 } from '@server/express/express2'
import { renderHtml } from '@server/express/render-html'

export async function useUserPwResetPage() {

  const web = await omanGetObject('Express2') as Express2

  web.router.get('/user-password-send-mail', function (req, res, done) {
    renderHtml(res, 'user/user-password-send-mail')
  })

  web.router.get('/user-password-send-mail-done', function (req, res, done) {
    renderHtml(res, 'user/user-password-send-mail-done')
  })

  web.router.get('/user-password-reset', function (req, res, done) {
    renderHtml(res, 'user/user-password-reset')
  })

}

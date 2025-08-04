import { getExpress2 } from '../../../express/express2.ts'
import { renderHtml } from '../../../express/response.ts'

export async function useUserPwResetPage() {

  const express2 = await getExpress2()

  express2.router.get('/user-password-mail', function (req, res, done) {
    renderHtml(res, 'user/user-password-mail')
  })

  express2.router.get('/user-password-mail-done', function (req, res, done) {
    renderHtml(res, 'user/user-password-mail-done')
  })

  express2.router.get('/user-password-reset/:id/:random', function (req, res, done) {
    renderHtml(res, 'user/user-password-reset')
  })

  express2.router.get('/user-password-reset-done', function (req, res, done) {
    renderHtml(res, 'user/user-password-reset-done')
  })

}

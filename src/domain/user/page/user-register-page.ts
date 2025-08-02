import { getExpress2 } from '../../../express/express2.js'
import { renderHtml } from '../../../express/response.js'

export async function useUserRegisterPage() {

  const express2 = await getExpress2()

  express2.router.get('/user-register', (req, res) => {
    renderHtml(res, 'user/user-register')
  })

  express2.router.get('/user-register-done', (req, res) => {
    renderHtml(res, 'user/user-register-done')
  })

}

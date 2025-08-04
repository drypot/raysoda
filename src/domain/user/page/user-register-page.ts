import { getExpress2 } from '../../../express/express2.ts'
import { renderHtml } from '../../../express/response.ts'

export async function useUserRegisterPage() {

  const express2 = await getExpress2()

  express2.router.get('/user-register', (req, res) => {
    renderHtml(res, 'user/user-register')
  })

  express2.router.get('/user-register-done', (req, res) => {
    renderHtml(res, 'user/user-register-done')
  })

}

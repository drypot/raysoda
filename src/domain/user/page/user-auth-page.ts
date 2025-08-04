import { getExpress2, toCallback } from '../../../express/express2.ts'
import { renderHtml } from '../../../express/response.ts'
import { userLogout } from '../api/user-auth-api.ts'


export async function useUserAuthPage() {

  const express2 = await getExpress2()

  express2.router.get('/user-login', (req, res) => {
    renderHtml(res, 'user/user-login')
  })

  express2.router.get('/user-logout', toCallback(async (req, res) => {
    await userLogout(req, res)
    res.redirect('/')
  }))

}

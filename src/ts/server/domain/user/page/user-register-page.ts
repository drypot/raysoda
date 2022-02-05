import { Express2 } from '@server/express/express2'
import { renderHtml } from '@server/express/response'
import { getObject } from '@server/oman/oman'

export async function useUserRegisterPage() {

  const web = await getObject('Express2') as Express2

  web.router.get('/user-register', (req, res) => {
    renderHtml(res, 'user/user-register')
  })

  web.router.get('/user-register-done', (req, res) => {
    renderHtml(res, 'user/user-register-done')
  })

}

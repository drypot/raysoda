import { Express2 } from '../../_express/express2'
import { renderHtml } from '../../_common/render-html'
import { omanGetObject } from '../../../oman/oman'

export async function useUserRegisterPage() {

  const web = await omanGetObject('Express2') as Express2

  web.router.get('/user-register', (req, res) => {
    renderHtml(res, 'user/user-register')
  })

  web.router.get('/user-register-done', (req, res) => {
    renderHtml(res, 'user/user-register-done')
  })

}

import { Express2 } from '../../../_express/express2'
import { renderHtml } from '../../_common/render-html'

export function registerUserRegisterPage(web: Express2) {

  web.router.get('/user-register', (req, res) => {
    renderHtml(res, 'user/user-register')
  })

  web.router.get('/user-register-done', (req, res) => {
    renderHtml(res, 'user/user-register-done')
  })

}

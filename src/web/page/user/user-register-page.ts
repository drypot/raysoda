import { Express2, renderHtml } from '../../_express/express2.js'

export function registerUserRegisterPage(web: Express2) {

  web.router.get('/user-register', (req, res) => {
    renderHtml(res, 'user/user-register')
  })

  web.router.get('/user-register-done', (req, res) => {
    renderHtml(res, 'user/user-register-done')
  })

}

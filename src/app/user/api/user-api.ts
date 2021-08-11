import { UserDB } from '../db/user-db.js'
import { Express2, toCallback } from '../../../lib/express/express2.js'
import { getUserForm } from '../form/user-form.js'
import { addUserService } from '../service/user-service.js'

export function initUserAPI(userdb: UserDB, web: Express2) {

  const router = web.router

  router.get('/user/register', (req, res) => {
    res.render('app/user/view/user-register')
  })

  router.get('/user/register-done', (req, res) => {
    res.render('app/user/view/user-register-done')
  })

  router.post('/api/user', toCallback(async function (req, res) {
    let form = getUserForm(req)
    form.home = form.name
    const user = await addUserService(userdb, form)
    res.json({ id: user.id })
  }))

}

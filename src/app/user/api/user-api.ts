import { UserDB } from '../db/user-db.js'
import { Express2, toCallback } from '../../../lib/express/express2.js'
import { addUserService } from '../service/user-service.js'
import { Request } from 'express'
import { UserForm } from '../form/user-form.js'
import { UserCache } from '../cache/user-cache.js'

export function initUserAPI(udb: UserDB, uc: UserCache, web: Express2) {

  const router = web.router

  // Register

  router.get('/user/register', (req, res) => {
    res.render('app/user/view/user-register')
  })

  router.get('/user/register-done', (req, res) => {
    res.render('app/user/view/user-register-done')
  })

  router.post('/api/user', toCallback(async (req, res) => {
    let form = getUserForm(req)
    form.home = form.name
    const user = await addUserService(udb, form)
    res.json({ id: user.id })
  }))

  function getUserForm(req: Request): UserForm {
    const body = req.body
    return {
      id: 0,
      name: String(body.name ?? '').trim(),
      home: String(body.home ?? '').trim(),
      email: String(body.email ?? '').trim(),
      password: String(body.password ?? '').trim(),
      profile: String(body.profile ?? '').trim(),
    }
  }

}

import { MSG_USER_NOT_FOUND, UserDB } from '../db/user-db.js'
import { Express2, toCallback } from '../../../lib/express/express2.js'
import { registerUserService } from './user-register-service.js'
import { Request } from 'express'
import { UserForm } from '../api-register-form/user-form.js'
import { FormError } from '../../../lib/base/error2.js'

export function registerUserRegisterApi(web: Express2, udb: UserDB) {

  const router = web.router

  // Pages

  router.get('/user/register', (req, res) => {
    res.render('app/user/api-register/user-register-view')
  })

  router.get('/user/register-done', (req, res) => {
    res.render('app/user/api-register/user-register-view-done')
  })

  // Api

  router.post('/api/user', toCallback(async (req, res) => {
    let form = userFormFrom(req)
    form.home = form.name
    const errs: FormError[] = []
    const user = await registerUserService(udb, form, errs)
    if (errs.length) throw errs
    if (!user) throw new Error(MSG_USER_NOT_FOUND)
    res.json({ id: user.id })
  }))

}

export function userFormFrom(req: Request): UserForm {
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

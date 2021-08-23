import { MSG_USER_NOT_FOUND, UserDB } from '../../../db/user/user-db.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { userRegisterService } from '../../../service/user/user-register-service.js'
import { Request } from 'express'
import { UserForm } from '../../../service/user/form/user-form.js'
import { FormError } from '../../../lib/base/error2.js'

export function registerUserRegisterApi(web: Express2, udb: UserDB) {

  const router = web.router

  router.post('/api/user', toCallback(async (req, res) => {
    let form = userFormFrom(req)
    form.home = form.name
    const errs: FormError[] = []
    const user = await userRegisterService(udb, form, errs)
    if (errs.length) throw errs
    if (!user) throw new Error(MSG_USER_NOT_FOUND)
    res.json({ id: user.id })
  }))

}

export function userFormFrom(req: Request): UserForm {
  const body = req.body
  return {
    name: String(body.name ?? '').trim(),
    home: String(body.home ?? '').trim(),
    email: String(body.email ?? '').trim(),
    password: String(body.password ?? '').trim(),
    profile: String(body.profile ?? '').trim(),
  }
}

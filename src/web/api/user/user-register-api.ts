import { UserDB } from '../../../db/user/user-db.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { userRegisterService } from '../../../service/user/user-register-service.js'
import { Request } from 'express'
import { newString } from '../../../_util/primitive.js'
import { ErrorConst } from '../../../_type/error.js'
import { UserRegisterForm } from '../../../_type/user-form.js'
import { renderJson } from '../_api/api.js'

export function newUserRegisterForm(req: Request): UserRegisterForm {
  const body = req.body
  return {
    name: newString(body.name).trim(),
    email: newString(body.email).trim(),
    password: newString(body.password).trim(),
  }
}

export function registerUserRegisterApi(web: Express2, udb: UserDB) {

  web.router.post('/api/user-register', toCallback(async (req, res) => {
    let form = newUserRegisterForm(req)
    const err: ErrorConst[] = []
    const user = await userRegisterService(udb, form, err)
    if (!user || err.length) throw err
    renderJson(res, { id: user.id })
  }))

}


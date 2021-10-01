import { UserDB } from '../../../db/user/user-db.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { userRegisterService } from '../../../service/user/user-register-service.js'
import { Request } from 'express'
import { UserRegisterForm } from '../../../service/user/_user-service.js'
import { paramToString } from '../../../_util/param.js'
import { ErrorConst } from '../../../_type/error.js'

export function userRegisterFormFrom(req: Request): UserRegisterForm {
  const body = req.body
  return {
    name: paramToString(body.name).trim(),
    email: paramToString(body.email).trim(),
    password: paramToString(body.password).trim(),
  }
}

export function registerUserRegisterApi(web: Express2, udb: UserDB) {

  const router = web.router

  router.post('/api/user-register', toCallback(async (req, res) => {
    let form = userRegisterFormFrom(req)
    const err: ErrorConst[] = []
    const user = await userRegisterService(udb, form, err)
    if (err.length) throw err
    if (!user) throw new Error()
    res.json({ id: user.id })
  }))

}


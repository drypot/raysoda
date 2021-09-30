import { UserDB } from '../../../db/user/user-db.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { userRegisterService } from '../../../service/user/user-register-service.js'
import { Request } from 'express'
import { UserRegisterForm } from '../../../service/user/_user-service.js'
import { Error2 } from '../../../_util/error2.js'
import { stringFrom } from '../../../_util/primitive.js'

export function userRegisterFormFrom(req: Request) {
  const body = req.body
  return {
    name: stringFrom(body.name).trim(),
    email: stringFrom(body.email).trim(),
    password: stringFrom(body.password).trim(),
  } as UserRegisterForm
}

export function registerUserRegisterApi(web: Express2, udb: UserDB) {

  const router = web.router

  router.post('/api/user-register', toCallback(async (req, res) => {
    let form = userRegisterFormFrom(req)
    const err: Error2[] = []
    const user = await userRegisterService(udb, form, err)
    if (err.length) throw err
    if (!user) throw new Error()
    res.json({ id: user.id })
  }))

}


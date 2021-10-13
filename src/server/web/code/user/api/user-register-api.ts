import { UserDB } from '../../../../db/user/user-db'
import { Express2, toCallback } from '../../../_express/express2'
import { userRegisterService } from '../../../../service/user/user-register-service'
import { Request } from 'express'
import { newString } from '../../../../_util/primitive'
import { ErrorConst } from '../../../../_type/error'
import { UserRegisterForm } from '../../../../_type/user-form'
import { renderJson } from '../../_common/render-json'
import { omanGetObject } from '../../../../oman/oman'

export function newUserRegisterForm(req: Request): UserRegisterForm {
  const body = req.body
  return {
    name: newString(body.name).trim(),
    email: newString(body.email).trim(),
    password: newString(body.password).trim(),
  }
}

export async function useUserRegisterApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.post('/api/user-register', toCallback(async (req, res) => {
    let form = newUserRegisterForm(req)
    const err: ErrorConst[] = []
    const user = await userRegisterService(udb, form, err)
    if (!user || err.length) throw err
    renderJson(res, { id: user.id })
  }))

}


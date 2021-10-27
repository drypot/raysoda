import { ErrorConst } from '@common/type/error'
import { UserRegisterForm } from '@common/type/user-form'
import { Express2, toCallback } from '@server/express/express2'
import { userRegister } from '@server/domain/user/_service/user-register'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/express/render-json'
import { newString } from '@common/util/primitive'
import { Request } from 'express'

export function newUserRegisterFormFromReq(req: Request): UserRegisterForm {
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
    let form = newUserRegisterFormFromReq(req)
    const err: ErrorConst[] = []
    const user = await userRegister(udb, form, err)
    if (!user || err.length) throw err
    renderJson(res, {
      user: {
        id: user.id,
      }
    })
  }))
}


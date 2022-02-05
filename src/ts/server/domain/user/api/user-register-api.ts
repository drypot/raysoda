import { ErrorConst } from '@common/type/error'
import { UserRegisterForm } from '@common/type/user-form'
import { Express2, toCallback } from '@server/express/express2'
import { registerUser } from '@server/domain/user/_service/user-register'
import { getObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { newString } from '@common/util/primitive'
import { renderJson } from '@server/express/response'

export async function useUserRegisterApi() {

  const web = await getObject('Express2') as Express2
  const udb = await getObject('UserDB') as UserDB

  web.router.post('/api/user-register', toCallback(async (req, res) => {
    const body = req.body
    const form: UserRegisterForm = {
      email: newString(body.email).trim(),
      password: newString(body.password).trim()
    }
    const err: ErrorConst[] = []
    const user = await registerUser(udb, form, err)
    if (!user || err.length) throw err
    renderJson(res, {
      user: {
        id: user.id,
      }
    })
  }))
}


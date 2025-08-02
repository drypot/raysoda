import { getExpress2, toCallback } from '../../../express/express2.js'
import { getUserDB } from '../../../db/user/user-db.js'
import { UserRegisterForm } from '../../../common/type/user-form.js'
import { newString } from '../../../common/util/primitive.js'
import { ErrorConst } from '../../../common/type/error.js'
import { registerUser } from '../service/user-register.js'
import { renderJson } from '../../../express/response.js'

export async function useUserRegisterApi() {

  const express2 = await getExpress2()
  const udb = await getUserDB()

  express2.router.post('/api/user-register', toCallback(async (req, res) => {
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


import { UserDB } from '../../../db/user/user-db.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { sessionUserFrom, userCanUpdate } from './user-login-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../service/user/form/user-form.js'
import { userFormFrom } from './user-register-api.js'
import { FormError } from '../../../lib/base/error2.js'
import { userUpdateService } from '../../../service/user/user-update-service.js'

export function registerUserUpdateApi(web: Express2, udb: UserDB) {

  const router = web.router

  router.put('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = parseInt(req.params.id) || 0
    if (!userCanUpdate(user, id)) throw NOT_AUTHORIZED
    const form = userFormFrom(req)
    const errs: FormError[] = []
    await userUpdateService(udb, id, form, errs)
    if (errs.length) throw errs
    res.json({})
  }))

}

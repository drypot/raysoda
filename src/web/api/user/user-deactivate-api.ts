import { Express2, toCallback } from '../../_express/express2.js'
import { userDeactivateService } from '../../../service/user/user-deactivate-service.js'
import { newNumber } from '../../../_util/primitive.js'
import { NOT_AUTHORIZED } from '../../../_type/error-user.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'
import { getSessionUser, hasUpdatePerm, logoutService, shouldBeUser } from '../user-login/login-api.js'

export function registerUserDeactivateApi(web: Express2, uc: UserCache) {

  web.router.put('/api/user-deactivate/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)

    const id = newNumber(req.params.id)
    if (!hasUpdatePerm(user, id)) throw NOT_AUTHORIZED

    const err: ErrorConst[] = []
    await userDeactivateService(uc, id, err)
    if (err.length) throw err
    if (user.id === id) {
      await logoutService(req, res)
    }
    res.json({})
  }))

}

import { Express2, toCallback } from '../../_express/express2.js'
import { hasUpdatePerm, loginUserFrom, logout } from '../user-login/login-api.js'
import { userDeactivateService } from '../../../service/user/user-deactivate-service.js'
import { paramToNumber } from '../../../_util/param.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../_type/error-user.js'
import { UserCache } from '../../../db/user/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'

export function registerUserDeactivateApi(web: Express2, uc: UserCache) {

  const router = web.router

  // Deactivate User
  router.put('/api/user-deactivate/:id([0-9]+)', toCallback(async (req, res) => {
    const user = loginUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED

    const id = paramToNumber(req.params.id)
    if (!hasUpdatePerm(user, id)) throw NOT_AUTHORIZED

    const err: ErrorConst[] = []
    await userDeactivateService(uc, id, err)
    if (err.length) throw err
    if (user.id === id) {
      await logout(req, res)
    }
    res.json({})
  }))

}

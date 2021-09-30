import { Express2, toCallback } from '../_express/express2.js'
import { Error2 } from '../../_util/error2.js'
import { hasUpdatePerm, logoutCurrentSession, sessionUserFrom } from '../user-login/login-api.js'
import { userDeactivateService } from '../../service/user/user-deactivate-service.js'
import { numberFrom } from '../../_util/primitive.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../_type/error-user.js'
import { UserCache } from '../../db/user/user-cache.js'

export function registerUserDeactivateApi(web: Express2, uc: UserCache) {

  const router = web.router

  // Deactivate User
  router.put('/api/user-deactivate/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED

    const id = numberFrom(req.params.id)
    if (!hasUpdatePerm(user, id)) throw NOT_AUTHORIZED

    const err: Error2[] = []
    await userDeactivateService(uc, id, err)
    if (err.length) throw err
    if (user.id === id) {
      await logoutCurrentSession(req, res)
    }
    res.json({})
  }))

}

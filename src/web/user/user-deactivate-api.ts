import { UserDB } from '../../db/user/user-db.js'
import { Express2, toCallback } from '../_express/express2.js'
import { Error2 } from '../../_error/error2.js'
import { hasUpdatePerm, logoutCurrentSession, sessionUserFrom } from './user-login-api.js'
import { userDeactivateService } from '../../service/user/user-deactivate-service.js'
import { numberFrom } from '../../_util/primitive.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../_error/error-user.js'

export function registerUserDeactivateApi(web: Express2, udb: UserDB) {

  const router = web.router

  // Deactivate User
  router.put('/api/user-deactivate/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED

    const id = numberFrom(req.params.id)
    if (!hasUpdatePerm(user, id)) throw NOT_AUTHORIZED

    const err: Error2[] = []
    await userDeactivateService(udb, id, err)
    if (err.length) throw err
    if (user.id === id) {
      await logoutCurrentSession(req, res)
    }
    res.json({})
  }))

}

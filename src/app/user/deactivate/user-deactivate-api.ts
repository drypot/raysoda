import { UserDB } from '../db/user-db.js'
import { Express2, toCallback } from '../../../lib/express/express2.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../register-form/user-form.js'
import { FormError } from '../../../lib/base/error2.js'
import { logoutCurrentSession, sessionUserFrom, userCanUpdate } from '../login/user-login-api.js'
import { deactivateUserService } from './user-deactivate-service.js'

export function registerUserDeactivateApi(web: Express2, udb: UserDB) {

  const router = web.router

  // Pages

  router.get('/user/deactivate', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    res.render('app/user/deactivate/user-deactivate-view')
  }))

  // Api

  // Deactivate User
  router.delete('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED

    const id = parseInt(req.params.id) || 0
    if (!userCanUpdate(user, id)) throw NOT_AUTHORIZED

    const errs: FormError[] = []
    await deactivateUserService(udb, id, errs)
    if (errs.length) throw errs
    if (user.id === id) {
      await logoutCurrentSession(req, res)
    }
    res.json({})
  }))

}

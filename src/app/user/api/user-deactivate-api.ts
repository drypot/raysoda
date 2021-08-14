import { UserDB } from '../db/user-db.js'
import { Express2, toCallback } from '../../../lib/express/express2.js'
import { deactivateUser } from '../service/user-service.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../form/user-form.js'
import { FormError } from '../../../lib/base/error2.js'
import { getSessionUser, hasPermToUpdate, logoutCurrentSession } from './user-login-api.js'

export function initUserDeactivateApi(udb: UserDB, web: Express2) {

  const router = web.router

  // Pages

  router.get('/user/deactivate', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    if (!user) throw NOT_AUTHENTICATED
    res.render('app/user/view/user-deactivate')
  }))

  // Api

  // Deactivate User
  router.delete('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    if (!user) throw NOT_AUTHENTICATED

    const id = parseInt(req.params.id) || 0
    if (!hasPermToUpdate(user, id)) throw NOT_AUTHORIZED

    const errs = [] as FormError[]
    await deactivateUser(udb, id, errs)
    if (errs.length) throw errs
    if (user.id === id) {
      await logoutCurrentSession(req, res)
    }
    res.json({})
  }))

}

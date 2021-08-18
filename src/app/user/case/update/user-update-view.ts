import { UserDB } from '../../db/user-db.js'
import { Express2, toCallback } from '../../../../lib/express/express2.js'
import { sessionUserFrom, userCanUpdate } from '../login/user-login-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../register-form/user-form.js'

export function registerUserUpdateView(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/user/:id([0-9]+)/update', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = parseInt(req.params.id) || 0
    if (!userCanUpdate(user, id)) throw NOT_AUTHORIZED
    const user2 = await udb.getCachedById(id)
    res.render('app/user/case/update/user-update-view', {
      tuser: user2
    })
  }))

}

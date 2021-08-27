import { UserDB } from '../../../db/user/user-db.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { hasUpdatePerm, sessionUserFrom } from '../../api/user/user-login-api.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../service/user/form/user-form.js'

export function registerUserUpdateView(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/user/:id([0-9]+)/update', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = parseInt(req.params.id) || 0
    if (!hasUpdatePerm(user, id)) throw NOT_AUTHORIZED
    const user2 = await udb.getCachedById(id)
    res.render('user/user-update-view', {
      tuser: user2
    })
  }))

}

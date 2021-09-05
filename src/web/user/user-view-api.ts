import { UserDB } from '../../db/user/user-db.js'
import { Express2, toCallback } from '../_express/express2.js'
import { hasUpdatePerm, sessionUserFrom } from './user-login-api.js'
import { userViewService } from '../../service/user/user-view-service.js'
import { numberFrom } from '../../lib/base/primitive.js'

export function registerUserViewApi(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    const id = numberFrom(req.params.id)
    const priv = user ? hasUpdatePerm(user, id) : false
    const user2 = await userViewService(udb, id, priv)
    res.json({
      user: user2
    })
  }))
}

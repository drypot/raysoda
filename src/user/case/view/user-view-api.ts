import { UserDB } from '../../db/user-db.js'
import { Express2, toCallback } from '../../../lib/express/express2.js'
import { sessionUserFrom, userCanUpdate } from '../login/user-login-api.js'
import { userViewService } from './user-view-service.js'

export function registerUserViewApi(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    const id = parseInt(req.params.id) || 0
    const priv = user ? userCanUpdate(user, id) : false
    const user2 = await userViewService(udb, id, priv)
    res.json({
      user: user2
    })
  }))
}

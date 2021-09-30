import { Express2, toCallback } from '../../_express/express2.js'
import { hasUpdatePerm, sessionUserFrom } from '../user-login/login-api.js'
import { userDetailService } from '../../../service/user/user-detail-service.js'
import { numberFrom } from '../../../_util/primitive.js'
import { UserCache } from '../../../db/user/user-cache.js'

export function registerUserViewApi(web: Express2, uc: UserCache) {

  const router = web.router

  router.get('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    const id = numberFrom(req.params.id)
    const priv = user ? hasUpdatePerm(user, id) : false
    const user2 = await userDetailService(uc, id, priv)
    res.json({
      user: user2
    })
  }))
}

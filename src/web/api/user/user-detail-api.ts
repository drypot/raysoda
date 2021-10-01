import { Express2, toCallback } from '../../_express/express2.js'
import { hasUpdatePerm, loginUserFrom } from '../user-login/login-api.js'
import { userDetailService } from '../../../service/user/user-detail-service.js'
import { paramToNumber } from '../../../_util/param.js'
import { UserCache } from '../../../db/user/user-cache.js'

export function registerUserDetailApi(web: Express2, uc: UserCache) {

  const router = web.router

  router.get('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = loginUserFrom(res)
    const id = paramToNumber(req.params.id)
    const includePrivate = user ? hasUpdatePerm(user, id) : false
    const user2 = await userDetailService(uc, id, includePrivate)
    res.json({
      user: user2
    })
  }))
}

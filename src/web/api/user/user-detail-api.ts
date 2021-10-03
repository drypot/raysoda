import { Express2, toCallback } from '../../_express/express2.js'
import { userDetailService } from '../../../service/user/user-detail-service.js'
import { newNumber } from '../../../_util/primitive.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { getSessionUser, hasUpdatePerm } from '../user-login/login-api.js'

export function registerUserDetailApi(web: Express2, uc: UserCache) {

  web.router.get('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    const id = newNumber(req.params.id)
    const includePrivate = user ? hasUpdatePerm(user, id) : false
    const user2 = await userDetailService(uc, id, includePrivate)
    res.json({
      user: user2
    })
  }))

}

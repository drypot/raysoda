import { Express2, toCallback } from '../../_express/express2.js'
import { hasUpdatePerm, loginUserFrom } from '../../api/user-login/login-api.js'
import { paramToNumber } from '../../../_util/param.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../_type/error-user.js'
import { UserCache } from '../../../db/user/user-cache.js'

export function registerUserUpdatePage(web: Express2, uc: UserCache) {

  const router = web.router

  router.get('/user-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = loginUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = paramToNumber(req.params.id)
    if (!hasUpdatePerm(user, id)) throw NOT_AUTHORIZED
    const user2 = await uc.getCachedById(id)
    res.render('user/user-update', {
      tuser: user2
    })
  }))

}

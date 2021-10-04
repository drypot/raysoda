import { Express2, toCallback } from '../../_express/express2.js'
import { userGetService } from '../../../service/user/user-get-service.js'
import { newNumber } from '../../../_util/primitive.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { getSessionUser } from '../user-login/login-api.js'
import { ErrorConst } from '../../../_type/error.js'
import { userViewDateToTime } from '../../../_type/user-view.js'

export function registerUserGetApi(web: Express2, uc: UserCache) {

  web.router.get('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const user2 = await userGetService(uc, user, id, err)
    if (!user2 || err.length) throw err
    userViewDateToTime(user2)
    res.json({
      user: user2
    })
  }))

}

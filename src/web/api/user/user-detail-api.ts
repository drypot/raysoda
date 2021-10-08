import { Express2, toCallback } from '../../_express/express2.js'
import { userDetailService } from '../../../service/user/user-detail-service.js'
import { newNumber } from '../../../_util/primitive.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { getSessionUser } from '../user-login/login-api.js'
import { ErrorConst } from '../../../_type/error.js'
import { packUserDetail } from '../../../_type/user-detail.js'
import { renderJson } from '../_api/api.js'

export function registerUserDetailApi(web: Express2, uc: UserCache) {

  web.router.get('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const detail = await userDetailService(uc, user, id, err)
    if (!detail || err.length) throw err
    packUserDetail(detail)
    renderJson(res, {
      user: detail
    })
  }))

}

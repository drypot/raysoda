import { Express2, toCallback } from '../../../_express/express2'
import { userDetailService } from '../../../../service/user/user-detail-service'
import { newNumber } from '../../../../_util/primitive'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { ErrorConst } from '../../../../_type/error'
import { packUserDetail } from '../../../../_type/user-detail'
import { renderJson } from '../../_common/render-json'

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

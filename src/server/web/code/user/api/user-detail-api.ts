import { Express2, toCallback } from '../../../_express/express2'
import { userDetailService } from '../../../../service/user/user-detail-service'
import { newNumber } from '../../../../_util/primitive'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { ErrorConst } from '../../../../_type/error'
import { packUserDetail } from '../../../../_type/user-detail'
import { renderJson } from '../../_common/render-json'
import { omanGetObject } from '../../../../oman/oman'
import { UserDB } from '../../../../db/user/user-db'

export async function useUserDetailApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.get('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const detail = await userDetailService(udb, user, id, err)
    if (!detail || err.length) throw err
    packUserDetail(detail)
    renderJson(res, {
      user: detail
    })
  }))

}

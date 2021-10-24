import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/web/_express/express2'
import { getSessionUser } from '@server/web/user/api/user-auth-api'
import { packUserDetail } from '@common/type/user-detail'
import { newNumber } from '@common/util/primitive'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/web/_common/render-json'
import { userDetailService } from '@server/service/user/user-detail-service'

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

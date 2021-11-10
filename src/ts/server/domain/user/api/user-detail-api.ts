import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { packUserDetail } from '@common/type/user-detail'
import { newNumber } from '@common/util/primitive'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { userGetDetail } from '@server/domain/user/_service/user-detail'
import { renderJson } from '@server/express/respose'

export async function useUserDetailApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.get('/api/user/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const detail = await userGetDetail(udb, user, id, err)
    if (!detail || err.length) throw err
    packUserDetail(detail)
    renderJson(res, {
      user: detail
    })
  }))

}

import { userListService, userSearchService } from '@server/domain/user/_service/user-list-service'
import { Express2, toCallback } from '@server/express/express2'
import { getSessionUser } from '@server/domain/user/api/user-auth-api'
import { UserForList } from '@common/type/user-detail'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/express/render-json'
import { userIsAdmin } from '@common/type/user'
import { newLimitedNumber, newString } from '@common/util/primitive'

export async function useUserListApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.get('/api/user-list', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    const p = newLimitedNumber(req.query.p, 1, 1, NaN)
    const ps = newLimitedNumber(req.query.ps, 99, 1, 300)
    const q = newString(req.query.q)
    const admin = userIsAdmin(user)
    let list: UserForList[]
    if (q.length) {
      list = await userSearchService(udb, q, p, ps, admin)
    } else {
      list = await userListService(udb, p, ps)
    }
    renderJson(res, {
      userList: list
    })
  }))

}


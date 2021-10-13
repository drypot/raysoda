import { Express2, toCallback } from '../../../_express/express2'
import { UserDB } from '../../../../db/user/user-db'
import { newLimitedNumber, newString } from '../../../../_util/primitive'
import { userListService } from '../../../../service/user/user-list-service'
import { userSearchService } from '../../../../service/user/user-search-service'
import { UserForList } from '../../../../_type/user-detail'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { userIsAdmin } from '../../../../_type/user'
import { renderJson } from '../../_common/render-json'
import { omanGetObject } from '../../../../oman/oman'

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


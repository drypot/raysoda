import { Express2, toCallback } from '../../_express/express2.js'
import { UserDB } from '../../../db/user/user-db.js'
import { newLimitedNumber, newString } from '../../../_util/primitive.js'
import { userListService } from '../../../service/user/user-list-service.js'
import { userSearchService } from '../../../service/user/user-search-service.js'
import { UserForList } from '../../../_type/user-detail.js'
import { getSessionUser } from '../user-login/login-api.js'
import { userIsAdmin } from '../../../_type/user.js'

export function registerUserListApi(web: Express2, udb: UserDB) {

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
    res.json({
      userList: list
    })
  }))

}


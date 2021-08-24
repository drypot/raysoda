import { Express2, toCallback } from '../../_express/express2.js'
import { UserDB, UserListItem } from '../../../db/user/user-db.js'
import { putInRange } from '../../../lib/base/number2.js'
import { userListService, userSearchService } from '../../../service/user/user-list-service.js'

export function registerUserListApi(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/api/user', toCallback(async (req, res) => {
    let p = putInRange(parseInt(req.query.p as string) || 1, 1, NaN)
    let ps = putInRange(parseInt(req.query.ps as string) || 99, 1, 300)
    let q = req.query.q as string || ''
    let admin = res.locals.user && res.locals.user.admin
    let l: UserListItem[]
    if (q.length) {
      l = await userSearchService(udb, q, p, ps, admin)
    } else {
      l = await userListService(udb, p, ps)
    }
    res.json({
      user: l
    })
  }))

}

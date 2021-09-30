import { Express2, toCallback } from '../_express/express2.js'
import { UserDB, UserListItem } from '../../db/user/user-db.js'
import { limitedNumberFrom } from '../../_util/primitive.js'
import { userListService, userSearchService } from '../../service/user/user-list-service.js'

export function registerUserListApi(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/api/user-list', toCallback(async (req, res) => {
    let p = limitedNumberFrom(req.query.p as string, 1, 1, NaN)
    let ps = limitedNumberFrom(req.query.ps as string, 99, 1, 300)
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


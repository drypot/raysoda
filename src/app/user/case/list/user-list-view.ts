import { UserDB, UserListItem } from '../../db/user-db.js'
import { Express2, toCallback } from '../../../../lib/express/express2.js'
import { putInRange } from '../../../../lib/base/number2.js'
import { userListService, userSearchService } from './user-list-service.js'
import { UrlMaker } from '../../../../lib/base/url2.js'

export function registerUserListView(web: Express2, udb: UserDB) {

  const router = web.router

  router.get('/user', toCallback(async (req, res) => {
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
    res.render('app/user/case/list/user-list-view', {
      user: l,
      prev: p > 1 ? UrlMaker.from('/users').add('p', p - 1, 1).add('ps', ps, 100).gen() : undefined,
      next: l.length === ps ? UrlMaker.from('/users').add('p', p + 1).add('ps', ps, 100).gen() : undefined,
    })
  }))

}

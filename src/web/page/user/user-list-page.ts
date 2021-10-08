import { UserDB } from '../../../db/user/user-db.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { newLimitedNumber, newString } from '../../../_util/primitive.js'
import { userListService } from '../../../service/user/user-list-service.js'
import { UrlMaker } from '../../../_util/url2.js'
import { userSearchService } from '../../../service/user/user-search-service.js'
import { UserForList } from '../../../_type/user-detail.js'
import { getSessionUser } from '../../api/user-login/login-api.js'
import { userIsAdmin } from '../../../_type/user.js'
import { renderHtml } from '../_page/page.js'

export function registerUserListPage(web: Express2, udb: UserDB) {

  web.router.get('/user-list', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    const p = newLimitedNumber(req.query.p, 1, 1, NaN)
    const ps = newLimitedNumber(req.query.ps, 99, 1, 300)
    const q = newString(req.query.q)
    const admin = userIsAdmin(user)
    const list: UserForList[] =
      q.length ? await userSearchService(udb, q, p, ps, admin) :
      await userListService(udb, p, ps)
    renderHtml(res, 'user/user-list', {
      user: list,
      prev: p > 1 ? UrlMaker.from('/users').add('p', p - 1, 1).add('ps', ps, 100).toString() : undefined,
      next: list.length === ps ? UrlMaker.from('/users').add('p', p + 1).add('ps', ps, 100).toString() : undefined,
    })
  }))

}

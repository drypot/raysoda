import { renderHtml } from '@server/web/_common/render-html'
import { UserForList } from '@common/type/user-detail'
import { Express2, toCallback } from '@server/web/_express/express2'
import { userIsAdmin } from '@common/type/user'
import { newLimitedNumber, newString } from '@common/util/primitive'
import { userListService } from '@server/service/user/user-list-service'
import { getSessionUser } from '@server/web/user/api/user-auth-api'
import { UrlMaker } from '@common/util/url2'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { userSearchService } from '@server/service/user/user-search-service'

export async function useUserListPage() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

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

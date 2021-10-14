import { UserDB } from '../../../db/user/user-db'
import { Express2, toCallback } from '../../_express/express2'
import { newLimitedNumber, newString } from '../../../_util/primitive'
import { userListService } from '../../../service/user/user-list-service'
import { UrlMaker } from '../../../_util/url2'
import { userSearchService } from '../../../service/user/user-search-service'
import { UserForList } from '../../../_type/user-detail'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { userIsAdmin } from '../../../_type/user'
import { renderHtml } from '../../_common/render-html'
import { omanGetObject } from '../../../oman/oman'

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

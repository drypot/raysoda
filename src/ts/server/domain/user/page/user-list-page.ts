import { renderHtml } from '@server/express/response'
import { UserListItem } from '@common/type/user-detail'
import { Express2, toCallback } from '@server/express/express2'
import { userIsAdmin } from '@common/type/user'
import { newLimitedNumber, newString } from '@common/util/primitive'
import { getUserList, searchUser } from '@server/domain/user/_service/user-list'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { UrlMaker } from '@common/util/url2'
import { getObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'

export async function useUserListPage() {

  const web = await getObject('Express2') as Express2
  const udb = await getObject('UserDB') as UserDB

  web.router.get('/user-list', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    const p = newLimitedNumber(req.query.p, 1, 1, NaN)
    const ps = newLimitedNumber(req.query.ps, 100, 1, 300)
    const q = newString(req.query.q)
    const admin = userIsAdmin(user)
    const list: UserListItem[] =
      q.length ? await searchUser(udb, q, p, ps, admin) :
      await getUserList(udb, p, ps)
    renderHtml(res, 'user/user-list', {
      userList: list,
      prev: p > 1 ? UrlMaker.from('/user-list').add('p', p - 1, 1).add('ps', ps, 100).toString() : undefined,
      next: list.length === ps ? UrlMaker.from('/user-list').add('p', p + 1).add('ps', ps, 100).toString() : undefined,
    })
  }))

}

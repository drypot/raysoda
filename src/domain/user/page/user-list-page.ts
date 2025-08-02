import { getExpress2, toCallback } from '../../../express/express2.js'
import { getUserDB } from '../../../db/user/user-db.js'
import { userGetSessionUser } from '../api/user-auth-api.js'
import { newLimitedNumber, newString } from '../../../common/util/primitive.js'
import { userIsAdmin } from '../../../common/type/user.js'
import { UserListItem } from '../../../common/type/user-detail.js'
import { getUserList, searchUser } from '../service/user-list.js'
import { renderHtml } from '../../../express/response.js'
import { UrlMaker } from '../../../common/util/url2.js'

export async function useUserListPage() {

  const express2 = await getExpress2()
  const udb = await getUserDB()

  express2.router.get('/user-list', toCallback(async (req, res) => {
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

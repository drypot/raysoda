import { getExpress2, toCallback } from '../../../express/express2.ts'
import { getUserDB } from '../../../db/user/user-db.ts'
import { userGetSessionUser } from './user-auth-api.ts'
import { newLimitedNumber, newString } from '../../../common/util/primitive.ts'
import { userIsAdmin } from '../../../common/type/user.ts'
import type { UserListItem } from '../../../common/type/user-detail.ts'
import { getUserList, searchUser } from '../service/user-list.ts'
import { renderJson } from '../../../express/response.ts'

export async function useUserListApi() {

  const express2 = await getExpress2()
  const udb = await getUserDB()

  express2.router.get('/api/user-list', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    const p = newLimitedNumber(req.query.p, 1, 1, NaN)
    const ps = newLimitedNumber(req.query.ps, 99, 1, 300)
    const q = newString(req.query.q)
    const admin = userIsAdmin(user)
    let list: UserListItem[]
    if (q.length) {
      list = await searchUser(udb, q, p, ps, admin)
    } else {
      list = await getUserList(udb, p, ps)
    }
    renderJson(res, {
      userList: list
    })
  }))

}


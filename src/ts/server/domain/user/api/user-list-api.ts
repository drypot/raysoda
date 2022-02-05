import { getUserList, searchUser } from '@server/domain/user/_service/user-list'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { UserListItem } from '@common/type/user-detail'
import { getObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { userIsAdmin } from '@common/type/user'
import { newLimitedNumber, newString } from '@common/util/primitive'
import { renderJson } from '@server/express/response'

export async function useUserListApi() {

  const web = await getObject('Express2') as Express2
  const udb = await getObject('UserDB') as UserDB

  web.router.get('/api/user-list', toCallback(async (req, res) => {
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


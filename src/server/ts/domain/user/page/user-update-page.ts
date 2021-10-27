import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { userGetForUpdate } from '@server/domain/user/_service/user-update'
import { renderHtml } from '@server/express/render-html'
import { newNumber } from '@common/util/primitive'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { userAssertLogin } from '@server/domain/user/_service/user-auth'

export async function useUserUpdatePage() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.get('/user-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const user2 = await userGetForUpdate(udb, user, id, err)
    renderHtml(res, 'user/user-update', {
      user2: user2
    })
  }))

}

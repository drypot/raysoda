import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/express/express2'
import { getSessionUser } from '@server/domain/user/api/user-auth-api'
import { userUpdateGetService } from '@server/domain/user/_service/user-update-service'
import { renderHtml } from '@server/express/render-html'
import { newNumber } from '@common/util/primitive'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { shouldBeUser } from '@server/domain/user/_service/user-auth-service'

export async function useUserUpdatePage() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.get('/user-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const user2 = await userUpdateGetService(udb, user, id, err)
    renderHtml(res, 'user/user-update', {
      user2: user2
    })
  }))

}
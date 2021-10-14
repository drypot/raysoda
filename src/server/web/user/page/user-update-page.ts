import { Express2, toCallback } from '../../_express/express2'
import { newNumber } from '../../../_util/primitive'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { userUpdateGetService } from '../../../service/user/user-update-service'
import { ErrorConst } from '../../../_type/error'
import { renderHtml } from '../../_common/render-html'
import { shouldBeUser } from '../../../service/user-auth/user-auth-service'
import { omanGetObject } from '../../../oman/oman'
import { UserDB } from '../../../db/user/user-db'

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

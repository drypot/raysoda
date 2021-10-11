import { Express2, toCallback } from '../../../_express/express2'
import { newNumber } from '../../../../_util/primitive'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { userUpdateGetService } from '../../../../service/user/user-update-service'
import { ErrorConst } from '../../../../_type/error'
import { renderHtml } from '../../_common/render-html'
import { shouldBeUser } from '../../../../service/user-auth/user-auth-service'

export function registerUserUpdatePage(web: Express2, uc: UserCache) {

  web.router.get('/user-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const user2 = await userUpdateGetService(uc, user, id, err)
    renderHtml(res, 'user/user-update', {
      user2: user2
    })
  }))

}
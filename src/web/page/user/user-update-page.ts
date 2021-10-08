import { Express2, toCallback } from '../../_express/express2.js'
import { newNumber } from '../../../_util/primitive.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { getSessionUser, shouldBeUser } from '../../api/user-login/login-api.js'
import { userUpdateGetService } from '../../../service/user/user-update-service.js'
import { ErrorConst } from '../../../_type/error.js'
import { renderHtml } from '../_page/page.js'

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

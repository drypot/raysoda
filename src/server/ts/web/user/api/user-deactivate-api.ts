import { ErrorConst } from '@common/type/error'
import { getSessionUser, userLogoutService } from '@server/web/user-auth/api/user-auth-api'
import { Express2, toCallback } from '@server/web/_express/express2'
import { newNumber } from '@common/util/primitive'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/web/_common/render-json'
import { shouldBeUser } from '@server/service/user-auth/user-auth-service'
import { userDeactivateService } from '@server/service/user/user-deactivate-service'

export async function useUserDeactivateApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB

  web.router.put('/api/user-deactivate/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    await userDeactivateService(udb, user, id, err)
    if (err.length) throw err
    if (user.id === id) {
      await userLogoutService(req, res)
    }
    renderJson(res, {})
  }))

}

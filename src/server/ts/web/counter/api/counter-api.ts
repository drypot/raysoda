import { CounterDB } from '@server/db/counter/counter-db'
import { Express2, toCallback } from '@server/web/_express/express2'
import { getSessionUser } from '@server/web/user/api/user-auth-api'
import { shouldBeAdmin, shouldBeUser } from '@server/service/user-auth/user-auth-service'
import { omanGetObject } from '@server/oman/oman'
import { renderJson } from '@server/web/_common/render-json'
import { counterListService } from '@server/service/counter/counter-service'
import { newString } from '@common/util/primitive'

export async function useCounterApi() {

  const web = await omanGetObject('Express2') as Express2
  const cdb = await omanGetObject('CounterDB') as CounterDB

  web.router.get('/api/counter/:id', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    const id = newString(req.params.id)
    const b = newString(req.query.b)
    const e = newString(req.query.e)
    const r = await counterListService(cdb, id, b, e)
    renderJson(res, { counterList: r })
  }))

}

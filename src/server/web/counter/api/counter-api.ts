import { Express2, toCallback } from '../../_express/express2'
import { CounterDB } from '../../../db/counter/counter-db'
import { counterListService } from '../../../service/counter/counter-service'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { newString } from '../../../_util/primitive'
import { renderJson } from '../../_common/render-json'
import { shouldBeAdmin, shouldBeUser } from '../../../service/user-auth/user-auth-service'
import { omanGetObject } from '../../../oman/oman'

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

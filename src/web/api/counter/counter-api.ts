import { Express2, toCallback } from '../../_express/express2.js'
import { CounterDB } from '../../../db/counter/counter-db.js'
import { counterListService } from '../../../service/counter/counter-service.js'
import { getSessionUser, shouldBeAdmin, shouldBeUser } from '../user-login/login-api.js'
import { newString } from '../../../_util/primitive.js'

export function registerCounterApi(web: Express2, cdb: CounterDB) {

  web.router.get('/api/counter-list/:id', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    const id = newString(req.params.id)
    const b = newString(req.query.b)
    const e = newString(req.query.e)
    const r = await counterListService(cdb, id, b, e)
    res.json({ counterList: r })
  }))

}

import { Express2, toCallback } from '../../_express/express2.js'
import { CounterDB } from '../../../db/counter/counter-db.js'
import { getUser, shouldBeAdmin, shouldBeUser } from '../user-login/login-api.js'
import { counterListService } from '../../../service/counter/counter-service.js'

export function registerCounterApi(web: Express2, cdb: CounterDB) {
  web.router.get('/api/counter-list/:id', toCallback(async (req, res) => {
    const user = getUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    const id = req.params.id
    const b = req.query.b as string
    const e = req.query.e as string
    const r = await counterListService(cdb, id, b, e)
    res.json({ counterList: r })
  }))
}

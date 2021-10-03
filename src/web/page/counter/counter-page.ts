import { Express2, toCallback } from '../../_express/express2.js'
import { getUser, shouldBeAdmin, shouldBeUser } from '../../api/user-login/login-api.js'
import { CounterDB } from '../../../db/counter/counter-db.js'
import { counterIncService } from '../../../service/counter/counter-service.js'

export function registerCounterPage(web: Express2, cdb: CounterDB) {
  web.router.get('/counter-inc/:id', toCallback(async (req, res) => {
    await counterIncService(cdb, req.params.id)
    res.redirect(req.query.r as string)
  }))

  web.router.get('/counter', toCallback(async (req, res) => {
    const user = getUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    res.render('counter/counter')
  }))
}

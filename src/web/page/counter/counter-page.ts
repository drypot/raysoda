import { Express2, toCallback } from '../../_express/express2.js'
import { CounterDB } from '../../../db/counter/counter-db.js'
import { counterIncService } from '../../../service/counter/counter-service.js'
import { getSessionUser, shouldBeAdmin, shouldBeUser } from '../../api/user-login/login-api.js'

export function registerCounterPage(web: Express2, cdb: CounterDB) {

  web.router.get('/counter-inc/:id', toCallback(async (req, res) => {
    await counterIncService(cdb, req.params.id)
    res.redirect(req.query.r as string)
  }))

  web.router.get('/counter-list', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    res.render('counter/counter-list')
  }))

}

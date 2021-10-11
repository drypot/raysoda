import { Express2, toCallback } from '../../../_express/express2'
import { CounterDB } from '../../../../db/counter/counter-db'
import { counterIncService } from '../../../../service/counter/counter-service'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { renderHtml } from '../../_common/render-html'
import { shouldBeAdmin, shouldBeUser } from '../../../../service/user-auth/user-auth-service'

export function registerCounterPage(web: Express2, cdb: CounterDB) {

  web.router.get('/counter-inc/:id', toCallback(async (req, res) => {
    await counterIncService(cdb, req.params.id)
    res.redirect(req.query.r as string)
  }))

  web.router.get('/counter-list', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    renderHtml(res, 'counter/counter-list')
  }))

}

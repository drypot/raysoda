import { CounterDB } from '@server/db/counter/counter-db'
import { Express2, toCallback } from '@server/web/_express/express2'
import { getSessionUser } from '@server/web/user-auth/api/user-auth-api'
import { shouldBeAdmin, shouldBeUser } from '@server/service/user-auth/user-auth-service'
import { renderHtml } from '@server/web/_common/render-html'
import { omanGetObject } from '@server/oman/oman'
import { counterIncService } from '@server/service/counter/counter-service'

export async function useCounterPage() {

  const web = await omanGetObject('Express2') as Express2
  const cdb = await omanGetObject('CounterDB') as CounterDB

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

import { CounterDB } from '@server/db/counter/counter-db'
import { Express2, toCallback } from '@server/express/express2'
import { getSessionUser } from '@server/domain/user/api/user-auth-api'
import { shouldBeAdmin, shouldBeUser } from '@server/domain/user/_service/user-auth-service'
import { renderHtml } from '@server/express/render-html'
import { omanGetObject } from '@server/oman/oman'
import { counterIncService } from '@server/domain/counter/_service/counter-service'

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

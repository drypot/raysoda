import { CounterDB } from '@server/db/counter/counter-db'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { assertAdmin, assertLoggedIn } from '@server/domain/user/_service/user-auth'
import { renderHtml } from '@server/express/response'
import { getObject } from '@server/oman/oman'
import { incCounter } from '@server/domain/counter/_service/counter-service'

export async function useCounterPage() {

  const web = await getObject('Express2') as Express2
  const cdb = await getObject('CounterDB') as CounterDB

  web.router.get('/counter-inc/:id', toCallback(async (req, res) => {
    await incCounter(cdb, req.params.id)
    res.redirect(req.query.r as string)
  }))

  web.router.get('/counter-list', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    assertAdmin(user)
    renderHtml(res, 'counter/counter-list')
  }))

}

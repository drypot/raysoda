import { CounterDB } from '@server/db/counter/counter-db'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { userAssertAdmin, userAssertLogin } from '@server/domain/user/_service/user-auth'
import { renderHtml } from '@server/express/render-html'
import { omanGetObject } from '@server/oman/oman'
import { counterIncrease } from '@server/domain/counter/_service/counter-service'

export async function useCounterPage() {

  const web = await omanGetObject('Express2') as Express2
  const cdb = await omanGetObject('CounterDB') as CounterDB

  web.router.get('/counter-inc/:id', toCallback(async (req, res) => {
    await counterIncrease(cdb, req.params.id)
    res.redirect(req.query.r as string)
  }))

  web.router.get('/counter-list', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    userAssertAdmin(user)
    renderHtml(res, 'counter/counter-list')
  }))

}

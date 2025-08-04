import { getExpress2, toCallback } from '../../../express/express2.ts'
import { getCounterDB } from '../../../db/counter/counter-db.ts'
import { incCounter } from '../service/counter-service.ts'
import { userGetSessionUser } from '../../user/api/user-auth-api.ts'
import { assertAdmin, assertLoggedIn } from '../../user/service/user-auth.ts'
import { renderHtml } from '../../../express/response.ts'

export async function useCounterPage() {

  const express2 = await getExpress2()
  const cdb = await getCounterDB()

  express2.router.get('/counter-inc/:id', toCallback(async (req, res) => {
    await incCounter(cdb, req.params.id)
    res.redirect(req.query.r as string)
  }))

  express2.router.get('/counter-list', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    assertAdmin(user)
    renderHtml(res, 'counter/counter-list')
  }))

}

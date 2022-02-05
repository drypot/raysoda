import { CounterDB } from '@server/db/counter/counter-db'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { assertAdmin, assertLoggedIn } from '@server/domain/user/_service/user-auth'
import { getObject } from '@server/oman/oman'
import { getCounterList } from '@server/domain/counter/_service/counter-service'
import { newString } from '@common/util/primitive'
import { renderJson } from '@server/express/response'

export async function useCounterApi() {

  const web = await getObject('Express2') as Express2
  const cdb = await getObject('CounterDB') as CounterDB

  web.router.get('/api/counter-list/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    assertAdmin(user)
    const id = newString(req.params.id)
    const begin = newString(req.query.b)
    const end = newString(req.query.e)
    const r = await getCounterList(cdb, id, begin, end)
    renderJson(res, { counterList: r })
  }))

}

import { CounterDB } from '@server/db/counter/counter-db'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { userAssertAdmin, userAssertLogin } from '@server/domain/user/_service/user-auth'
import { omanGetObject } from '@server/oman/oman'
import { renderJson } from '@server/express/render-json'
import { counterGetList } from '@server/domain/counter/_service/counter-service'
import { newString } from '@common/util/primitive'

export async function useCounterApi() {

  const web = await omanGetObject('Express2') as Express2
  const cdb = await omanGetObject('CounterDB') as CounterDB

  web.router.get('/api/counter-list/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    userAssertAdmin(user)
    const id = newString(req.params.id)
    const begin = newString(req.query.b)
    const end = newString(req.query.e)
    const r = await counterGetList(cdb, id, begin, end)
    renderJson(res, { counterList: r })
  }))

}

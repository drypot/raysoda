import { getExpress2, toCallback } from '../../../express/express2.js'
import { getCounterDB } from '../../../db/counter/counter-db.js'
import { userGetSessionUser } from '../../user/api/user-auth-api.js'
import { assertAdmin, assertLoggedIn } from '../../user/service/user-auth.js'
import { newString } from '../../../common/util/primitive.js'
import { getCounterList } from '../service/counter-service.js'
import { renderJson } from '../../../express/response.js'

export async function useCounterApi() {

  const express2 = await getExpress2()
  const cdb = await getCounterDB()

  express2.router.get('/api/counter-list/:id', toCallback(async (req, res) => {
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

import { getExpress2, toCallback } from '../../../express/express2.js'
import { getUserDB } from '../../../db/user/user-db.js'
import { userGetSessionUser } from './user-auth-api.js'
import { newNumber } from '../../../common/util/primitive.js'
import { ErrorConst } from '../../../common/type/error.js'
import { getUserDetail } from '../service/user-detail.js'
import { packUserDetail } from '../../../common/type/user-detail.js'
import { renderJson } from '../../../express/response.js'

export async function useUserDetailApi() {

  const express2 = await getExpress2()
  const udb = await getUserDB()

  // 2025-08-02
  // 예전엔 '/api/user/:id([0-9]+)' 이 수식을 사용했는데
  // 오늘 테스트 돌리니 () 를 이제 안 받는다고 한다.
  // 빼도 큰 문제 없을 것 같아서 일단 뺐다.

  express2.router.get('/api/user/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const detail = await getUserDetail(udb, user, id, err)
    if (!detail || err.length) throw err
    packUserDetail(detail)
    renderJson(res, {
      user: detail
    })
  }))

}

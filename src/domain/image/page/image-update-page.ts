import { getImageDB } from '../../../db/image/image-db.ts'
import { getExpress2, toCallback } from '../../../express/express2.ts'
import { userGetSessionUser } from '../../user/api/user-auth-api.ts'
import { assertLoggedIn } from '../../user/service/user-auth.ts'
import { newNumber } from '../../../common/util/primitive.ts'
import type { ErrorConst } from '../../../common/type/error.ts'
import { getImageForUpdate } from '../service/image-update.ts'
import { renderHtml } from '../../../express/response.ts'

export async function useImageUpdatePage() {

  const express2 = await getExpress2()
  const idb = await getImageDB()

  express2.router.get('/image-update/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await getImageForUpdate(idb, user, id, err)
    if (err.length) throw err
    renderHtml(res, 'image/image-update', { form: { image } })
  }))

}

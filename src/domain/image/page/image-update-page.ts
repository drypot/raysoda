import { getImageDB } from '../../../db/image/image-db.js'
import { getExpress2, toCallback } from '../../../express/express2.js'
import { userGetSessionUser } from '../../user/api/user-auth-api.js'
import { assertLoggedIn } from '../../user/service/user-auth.js'
import { newNumber } from '../../../common/util/primitive.js'
import { ErrorConst } from '../../../common/type/error.js'
import { getImageForUpdate } from '../service/image-update.js'
import { renderHtml } from '../../../express/response.js'

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

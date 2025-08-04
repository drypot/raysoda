import { getExpress2, toCallback } from '../../../express/express2.ts'
import { getImageDB } from '../../../db/image/image-db.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { getConfig } from '../../../oman/oman.ts'
import { userGetSessionUser } from '../../user/api/user-auth-api.ts'
import { assertLoggedIn } from '../../user/service/user-auth.ts'
import { newNumber } from '../../../common/util/primitive.ts'
import type { ErrorConst } from '../../../common/type/error.ts'
import { deleteImage } from '../service/image-delete.ts'
import { renderJson } from '../../../express/response.ts'

export async function useImageDeleteApi() {

  const express2 = await getExpress2()
  const idb = await getImageDB()
  const ifm = await getImageFileManager(getConfig().appNamel)

  express2.router.delete('/api/image-delete/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    await deleteImage(idb, ifm, user, id, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}

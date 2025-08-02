import { getExpress2, toCallback } from '../../../express/express2.js'
import { getImageDB } from '../../../db/image/image-db.js'
import { getImageFileManager } from '../../../fileman/fileman-loader.js'
import { getConfig } from '../../../oman/oman.js'
import { userGetSessionUser } from '../../user/api/user-auth-api.js'
import { assertLoggedIn } from '../../user/service/user-auth.js'
import { newNumber } from '../../../common/util/primitive.js'
import { ErrorConst } from '../../../common/type/error.js'
import { deleteImage } from '../service/image-delete.js'
import { renderJson } from '../../../express/response.js'

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

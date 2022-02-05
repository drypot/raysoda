import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { getImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { newNumber } from '@common/util/primitive'
import { getConfig, getObject } from '@server/oman/oman'
import { deleteImage } from '@server/domain/image/_service/image-delete'
import { assertLoggedIn } from '@server/domain/user/_service/user-auth'
import { renderJson } from '@server/express/response'

export async function useImageDeleteApi() {

  const web = await getObject('Express2') as Express2
  const idb = await getObject('ImageDB') as ImageDB
  const ifm = await getImageFileManager(getConfig().appNamel)

  web.router.delete('/api/image-delete/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    await deleteImage(idb, ifm, user, id, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}

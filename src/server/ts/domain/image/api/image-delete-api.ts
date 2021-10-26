import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/express/express2'
import { getSessionUser } from '@server/domain/user/api/user-auth-api'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { newNumber } from '@common/util/primitive'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { renderJson } from '@server/express/render-json'
import { imageDeleteService } from '@server/domain/image/_service/image-delete-service'
import { shouldBeUser } from '@server/domain/user/_service/user-auth-service'

export async function useImageDeleteApi() {

  const web = await omanGetObject('Express2') as Express2
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.delete('/api/image-delete/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    await imageDeleteService(idb, ifm, user, id, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}
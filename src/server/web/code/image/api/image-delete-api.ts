import { Express2, toCallback } from '../../../_express/express2'
import { ImageDB } from '../../../../db/image/image-db'
import { imageDeleteService } from '../../../../service/image/image-delete-service'
import { newNumber } from '../../../../_util/primitive'
import { ErrorConst } from '../../../../_type/error'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { renderJson } from '../../_common/render-json'
import { shouldBeUser } from '../../../../service/user-auth/user-auth-service'
import { omanGetConfig, omanGetObject } from '../../../../oman/oman'
import { omanGetImageFileManager } from '../../../../file/_fileman-loader'

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

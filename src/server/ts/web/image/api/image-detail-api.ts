import { newNumber } from '@common/util/primitive'
import { packImageDetail } from '@common/type/image-detail'
import { Express2, toCallback } from '@server/web/_express/express2'
import { ErrorConst } from '@common/type/error'
import { getSessionUser } from '@server/web/user-auth/api/user-auth-api'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { imageDetailService } from '@server/service/image/image-detail-service'
import { ImageDB } from '@server/db/image/image-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/web/_common/render-json'

export async function useImageDetailApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.get('/api/image/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await imageDetailService(udb, idb, ifm, user, id, err)
    if (!image || err.length) throw err
    packImageDetail(image)
    renderJson(res, { image })
  }))

}

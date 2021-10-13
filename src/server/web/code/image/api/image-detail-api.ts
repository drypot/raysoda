import { Express2, toCallback } from '../../../_express/express2'
import { ImageDB } from '../../../../db/image/image-db'
import { imageDetailService } from '../../../../service/image/image-detail-service'
import { newNumber } from '../../../../_util/primitive'
import { ErrorConst } from '../../../../_type/error'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { packImageDetail } from '../../../../_type/image-detail'
import { renderJson } from '../../_common/render-json'
import { omanGetConfig, omanGetObject } from '../../../../oman/oman'
import { UserDB } from '../../../../db/user/user-db'
import { omanGetImageFileManager } from '../../../../file/_fileman-loader'

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

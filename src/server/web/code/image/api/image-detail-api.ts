import { Express2, toCallback } from '../../../_express/express2'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageFileManager } from '../../../../file/fileman'
import { imageDetailService } from '../../../../service/image/image-detail-service'
import { newNumber } from '../../../../_util/primitive'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { ErrorConst } from '../../../../_type/error'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { packImageDetail } from '../../../../_type/image-detail'
import { renderJson } from '../../_common/render-json'

export function registerImageDetailApi(web: Express2, uc: UserCache, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/api/image/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await imageDetailService(uc, idb, ifm, user, id, err)
    if (!image || err.length) throw err
    packImageDetail(image)
    renderJson(res, { image })
  }))

}

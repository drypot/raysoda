import { Express2, toCallback } from '../../../_express/express2.js'
import { ImageDB } from '../../../../db/image/image-db.js'
import { ImageFileManager } from '../../../../file/fileman.js'
import { imageDetailService } from '../../../../service/image/image-detail-service.js'
import { newNumber } from '../../../../_util/primitive.js'
import { UserCache } from '../../../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../../../_type/error.js'
import { getSessionUser } from '../../user-auth/api/user-auth-api.js'
import { packImageDetail } from '../../../../_type/image-detail.js'
import { renderJson } from '../../_common/render-json.js'

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

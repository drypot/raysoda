import { Express2, toCallback } from '../../_express/express2.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { imageDetailService } from '../../../service/image/image-detail-service.js'
import { newNumber } from '../../../_util/primitive.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'
import { getSessionUser } from '../../api/user-login/login-api.js'
import { renderHtml } from '../_common/render-html.js'

export function registerImageDetailPage(web: Express2, uc: UserCache, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/image/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await imageDetailService(uc, idb, ifm, user, id, err)
    if (!image || err.length) throw err
    renderHtml(res, 'image/image-detail', { image })
  }))

}

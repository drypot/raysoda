import { Express2, toCallback } from '../../_express/express2.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { imageDetailService } from '../../../service/image/image-detail-service.js'
import { loginUserFrom } from '../../api/user-login/login-api.js'
import { paramToNumber } from '../../../_util/param.js'
import { UserCache } from '../../../db/user/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'

export function registerImageDetailPage(web: Express2, uc: UserCache, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/image/:id([0-9]+)', toCallback(async (req, res) => {
    const user = loginUserFrom(res)
    const id = paramToNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await imageDetailService(uc, idb, ifm, id, err)
    if (err.length) throw err
    if (!image) throw new Error()
    image.updatable = user !== undefined && (image.owner.id === user.id || user.admin)
    res.render('image/image-detail', { image: image })
  }))

}

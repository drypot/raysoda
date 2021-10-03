import { Express2, toCallback } from '../../_express/express2.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { imageDetailService } from '../../../service/image/image-detail-service.js'
import { newNumber } from '../../../_util/primitive.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'
import { getSessionUser } from '../user-login/login-api.js'

export function registerImageDetailApi(web: Express2, uc: UserCache, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/api/image/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await imageDetailService(uc, idb, ifm, id, err)
    if (!image || err.length) throw err
    image.updatable = image.owner.id === user.id || user.admin
    res.json({ image: image })
  }))

  web.router.get('/api/image-first-image-cdate', toCallback(async (req, res) => {
    const image = await idb.findFirstImage()
    res.json({
      today: Date.now(),
      cdate: image?.cdate.getTime()
    })
  }))

}

import { Express2, toCallback } from '../_express/express2.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { imageDetailService } from '../../service/image/image-detail-service.js'
import { Error2 } from '../../_util/error2.js'
import { sessionUserFrom } from '../user-login/login-api.js'
import { numberFrom } from '../../_util/primitive.js'
import { UserCache } from '../../db/user/user-cache.js'

export function registerImagePage(web: Express2, uc: UserCache, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/image/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    const id = numberFrom(req.params.id)
    const err: Error2[] = []
    const image = await imageDetailService(uc, idb, ifm, id, err)
    if (err.length) throw err
    if (!image) throw new Error()
    image.updatable = user !== undefined && (image.owner.id === user.id || user.admin)
    res.render('image/pug/image-detail', { image: image })
  }))

}

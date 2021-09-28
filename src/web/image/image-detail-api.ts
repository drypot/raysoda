import { Express2, toCallback } from '../_express/express2.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { imageDetailService } from '../../service/image/image-detail-service.js'
import { Error2 } from '../../_error/error2.js'
import { sessionUserFrom } from '../user/user-login-api.js'
import { numberFrom } from '../../_util/primitive.js'

export function registerImageViewApi(web: Express2, udb: UserDB, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/api/image/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    const id = numberFrom(req.params.id)
    const err: Error2[] = []
    const image = await imageDetailService(udb, idb, ifm, id, err)
    if (err.length) throw err
    if (!image) throw new Error()
    image.updatable = user !== undefined && (image.owner.id === user.id || user.admin)
    res.json({ image: image })
  }))

  web.router.get('/api/image/first-image-cdate', toCallback(async (req, res) => {
    const image = await idb.findFirstImage()
    res.json({
      today: Date.now(),
      cdate: image?.cdate.getTime()
    })
  }))

}

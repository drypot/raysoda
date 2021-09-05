import { Express2, toCallback } from '../_express/express2.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { imageViewService } from '../../service/image/image-view-service.js'
import { Error2 } from '../../lib/base/error2.js'
import { sessionUserFrom } from '../user/user-login-api.js'
import { numberFrom } from '../../lib/base/primitive.js'

export function registerImageView(web: Express2, udb: UserDB, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/images/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    const id = numberFrom(req.params.id)
    const err: Error2[] = []
    const image = await imageViewService(udb, idb, ifm, id, err)
    if (err.length) throw err
    if (!image) throw new Error()
    image.updatable = user !== undefined && (image.owner.id === user.id || user.admin)
    res.render('image/image-view', { image: image })
  }))

}

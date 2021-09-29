import { Express2, toCallback } from '../_express/express2.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { sessionUserFrom } from '../user-login/login-api.js'
import { Error2 } from '../../_error/error2.js'
import { checkImageUpdatable } from '../../service/image/image-update-service.js'
import { imageDeleteService } from '../../service/image/image-delete-service.js'
import { numberFrom } from '../../_util/primitive.js'
import { NOT_AUTHENTICATED } from '../../_error/error-user.js'

export function registerImageDeleteApi(web: Express2, idb: ImageDB, ifm: ImageFileManager) {

  web.router.delete('/api/image-delete/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = numberFrom(req.params.id)
    const err: Error2[] = []
    const image = await idb.findImage(id)
    await checkImageUpdatable(user, image, err)
    if (err.length) throw err
    await imageDeleteService(idb, ifm, id, err)
    if (err.length) throw err
    res.json({})
  }))
}

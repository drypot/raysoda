import { Express2, toCallback } from '../_express/express2.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { sessionUserFrom } from '../user/user-login-api.js'
import { NOT_AUTHENTICATED } from '../../service/user/form/user-form.js'
import { Error2 } from '../../lib/base/error2.js'
import { checkImageUpdatable } from '../../service/image/image-update-service.js'
import { imageDeleteService } from '../../service/image/image-delete-service.js'

export function registerImageDeleteApi(web: Express2, idb: ImageDB, ifm: ImageFileManager) {

  web.router.delete('/api/image/:id([0-9]+)', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = parseInt(req.params.id) || 0
    const err: Error2[] = []
    const image = await idb.findImage(id)
    await checkImageUpdatable(user, image, err)
    if (err.length) throw err
    await imageDeleteService(idb, ifm, id, err)
    if (err.length) throw err
    res.json({})
  }))

}

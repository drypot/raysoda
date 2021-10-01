import { Express2, toCallback } from '../../_express/express2.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { loginUserFrom } from '../user-login/login-api.js'
import { checkImageUpdatable } from '../../../service/image/image-update-service.js'
import { imageDeleteService } from '../../../service/image/image-delete-service.js'
import { paramToNumber } from '../../../_util/param.js'
import { NOT_AUTHENTICATED } from '../../../_type/error-user.js'
import { ErrorConst } from '../../../_type/error.js'

export function registerImageDeleteApi(web: Express2, idb: ImageDB, ifm: ImageFileManager) {

  web.router.delete('/api/image-delete/:id([0-9]+)', toCallback(async (req, res) => {
    const user = loginUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = paramToNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await idb.findImage(id)
    await checkImageUpdatable(user, image, err)
    if (err.length) throw err
    await imageDeleteService(idb, ifm, id, err)
    if (err.length) throw err
    res.json({})
  }))
}

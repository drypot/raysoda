import { Express2, toCallback } from '../../_express/express2.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { imageDeleteService } from '../../../service/image/image-delete-service.js'
import { newNumber } from '../../../_util/primitive.js'
import { ErrorConst } from '../../../_type/error.js'
import { getSessionUser, shouldBeUser } from '../user-login/login-api.js'
import { renderJson } from '../_api/api.js'

export function registerImageDeleteApi(web: Express2, idb: ImageDB, ifm: ImageFileManager) {

  web.router.delete('/api/image-delete/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    await imageDeleteService(idb, ifm, user, id, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}

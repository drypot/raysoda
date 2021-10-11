import { Express2, toCallback } from '../../../_express/express2'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageFileManager } from '../../../../file/fileman'
import { imageDeleteService } from '../../../../service/image/image-delete-service'
import { newNumber } from '../../../../_util/primitive'
import { ErrorConst } from '../../../../_type/error'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { renderJson } from '../../_common/render-json'
import { shouldBeUser } from '../../../../service/user-auth/user-auth-service'

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

import { Express2, toCallback } from '../../../_express/express2.js'
import { ImageDB } from '../../../../db/image/image-db.js'
import { newNumber } from '../../../../_util/primitive.js'
import { ErrorConst } from '../../../../_type/error.js'
import { imageUpdateGetService } from '../../../../service/image/image-update-service.js'
import { getSessionUser } from '../../user-auth/api/user-auth-api.js'
import { renderHtml } from '../../_common/render-html.js'
import { shouldBeUser } from '../../../../service/user-auth/user-auth-service.js'

export function registerImageUpdatePage(web: Express2, idb: ImageDB) {

  web.router.get('/image-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await imageUpdateGetService(idb, user, id, err)
    if (err.length) throw err
    renderHtml(res, 'image/image-update', {
      image
    })
  }))

}

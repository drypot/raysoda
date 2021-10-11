import { Express2, toCallback } from '../../../_express/express2'
import { ImageDB } from '../../../../db/image/image-db'
import { newNumber } from '../../../../_util/primitive'
import { ErrorConst } from '../../../../_type/error'
import { imageUpdateGetService } from '../../../../service/image/image-update-service'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { renderHtml } from '../../_common/render-html'
import { shouldBeUser } from '../../../../service/user-auth/user-auth-service'

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

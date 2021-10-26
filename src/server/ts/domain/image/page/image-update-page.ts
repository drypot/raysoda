import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/express/express2'
import { getSessionUser } from '@server/domain/user/api/user-auth-api'
import { renderHtml } from '@server/express/render-html'
import { ImageDB } from '@server/db/image/image-db'
import { newNumber } from '@common/util/primitive'
import { omanGetObject } from '@server/oman/oman'
import { shouldBeUser } from '@server/domain/user/_service/user-auth-service'
import { imageUpdateGetService } from '@server/domain/image/_service/image-update-service'

export async function useImageUpdatePage() {

  const web = await omanGetObject('Express2') as Express2
  const idb = await omanGetObject('ImageDB') as ImageDB

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
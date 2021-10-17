import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/web/_express/express2'
import { getSessionUser } from '@server/web/user-auth/api/user-auth-api'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { imageDetailService } from '@server/service/image/image-detail-service'
import { renderHtml } from '@server/web/_common/render-html'
import { ImageDB } from '@server/db/image/image-db'
import { newNumber } from '@common/util/primitive'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'

export async function useImageDetailPage() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.get('/image/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await imageDetailService(udb, idb, ifm, user, id, err)
    if (!image || err.length) throw err
    renderHtml(res, 'image/image-detail', { image })
  }))

}

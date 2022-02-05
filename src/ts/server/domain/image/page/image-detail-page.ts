import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { getImageFileManager } from '@server/fileman/_fileman-loader'
import { getImageDetail } from '@server/domain/image/_service/image-detail'
import { renderHtml } from '@server/express/response'
import { ImageDB } from '@server/db/image/image-db'
import { newNumber } from '@common/util/primitive'
import { getConfig, getObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'

export async function useImageDetailPage() {

  const web = await getObject('Express2') as Express2
  const udb = await getObject('UserDB') as UserDB
  const idb = await getObject('ImageDB') as ImageDB
  const ifm = await getImageFileManager(getConfig().appNamel)

  web.router.get('/image/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await getImageDetail(udb, idb, ifm, user, id, err)
    if (!image || err.length) throw err
    renderHtml(res, 'image/image-detail', { image })
  }))

}

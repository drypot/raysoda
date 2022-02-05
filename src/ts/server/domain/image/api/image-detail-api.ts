import { newNumber } from '@common/util/primitive'
import { packImageDetail } from '@common/type/image-detail'
import { Express2, toCallback } from '@server/express/express2'
import { ErrorConst } from '@common/type/error'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { getImageFileManager } from '@server/fileman/_fileman-loader'
import { getImageDetail } from '@server/domain/image/_service/image-detail'
import { ImageDB } from '@server/db/image/image-db'
import { getConfig, getObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/express/response'

export async function useImageDetailApi() {

  const web = await getObject('Express2') as Express2
  const udb = await getObject('UserDB') as UserDB
  const idb = await getObject('ImageDB') as ImageDB
  const ifm = await getImageFileManager(getConfig().appNamel)

  web.router.get('/api/image/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await getImageDetail(udb, idb, ifm, user, id, err)
    if (!image || err.length) throw err
    packImageDetail(image)
    renderJson(res, { image })
  }))

}

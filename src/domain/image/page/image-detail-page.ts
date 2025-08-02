import { getExpress2, toCallback } from '../../../express/express2.js'
import { getUserDB } from '../../../db/user/user-db.js'
import { getImageDB } from '../../../db/image/image-db.js'
import { getImageFileManager } from '../../../fileman/fileman-loader.js'
import { getConfig } from '../../../oman/oman.js'
import { userGetSessionUser } from '../../user/api/user-auth-api.js'
import { newNumber } from '../../../common/util/primitive.js'
import { ErrorConst } from '../../../common/type/error.js'
import { getImageDetail } from '../service/image-detail.js'
import { renderHtml } from '../../../express/response.js'

export async function useImageDetailPage() {

  const express2 = await getExpress2()
  const udb = await getUserDB()
  const idb = await getImageDB()
  const ifm = await getImageFileManager(getConfig().appNamel)

  express2.router.get('/image/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await getImageDetail(udb, idb, ifm, user, id, err)
    if (!image || err.length) throw err
    renderHtml(res, 'image/image-detail', { image })
  }))

}

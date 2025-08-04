import { getExpress2, toCallback } from '../../../express/express2.ts'
import { getUserDB } from '../../../db/user/user-db.ts'
import { getImageDB } from '../../../db/image/image-db.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { getConfig } from '../../../oman/oman.ts'
import { userGetSessionUser } from '../../user/api/user-auth-api.ts'
import { newNumber } from '../../../common/util/primitive.ts'
import type { ErrorConst } from '../../../common/type/error.ts'
import { getImageDetail } from '../service/image-detail.ts'
import { packImageDetail } from '../../../common/type/image-detail.ts'
import { renderJson } from '../../../express/response.ts'

export async function useImageDetailApi() {

  const express2 = await getExpress2()
  const udb = await getUserDB()
  const idb = await getImageDB()
  const ifm = await getImageFileManager(getConfig().appNamel)

  express2.router.get('/api/image/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await getImageDetail(udb, idb, ifm, user, id, err)
    if (!image || err.length) throw err
    packImageDetail(image)
    renderJson(res, { image })
  }))

}

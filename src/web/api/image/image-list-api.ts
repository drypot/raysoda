import { Express2, toCallback } from '../../_express/express2.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { newLimitedNumber } from '../../../_util/primitive.js'
import { imageListByCdateService, imageListService } from '../../../service/image/image-list-service.js'
import { ImageForList } from '../../../_type/image-view.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { newDate } from '../../../_util/date2.js'

export function registerImageListApi(web: Express2, uc: UserCache, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/api/image-list', toCallback(async (req, res) => {
    const p = newLimitedNumber(req.query.p as any, 1, 1, NaN)
    const ps = newLimitedNumber(req.query.ps as any, 16, 1, 128)
    const d = newDate(req.query.d as any)
    let list: ImageForList[]
    if (d) {
      list = await imageListByCdateService(uc, idb, ifm, d, p, ps)
    } else {
      list = await imageListService(uc, idb, ifm, p, ps)
    }
    res.json({
      list: list
    })
  }))

}

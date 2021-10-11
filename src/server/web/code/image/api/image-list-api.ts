import { Express2, toCallback } from '../../../_express/express2.js'
import { ImageDB } from '../../../../db/image/image-db.js'
import { ImageFileManager } from '../../../../file/fileman.js'
import { newLimitedNumber } from '../../../../_util/primitive.js'
import { imageListByCdateService, imageListService } from '../../../../service/image/image-list-service.js'
import { UserCache } from '../../../../db/user/cache/user-cache.js'
import { newDate } from '../../../../_util/date2.js'
import { firstImageCdateService } from '../../../../service/image/image-detail-service.js'
import { renderJson } from '../../_common/render-json.js'

export function registerImageListApi(web: Express2, uc: UserCache, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/api/image-list', toCallback(async (req, res) => {
    const p = newLimitedNumber(req.query.p, 1, 1, NaN)
    const ps = newLimitedNumber(req.query.ps, 16, 1, 128)
    const d = newDate(req.query.d)
    const list =d ?
      await imageListByCdateService(uc, idb, ifm, d, p, ps) :
      await imageListService(uc, idb, ifm, p, ps)
    renderJson(res, {
      list: list
    })
  }))

  web.router.get('/api/first-image-cdate', toCallback(async (req, res) => {
    const date = await firstImageCdateService(idb)
    renderJson(res, {
      todayNum: Date.now(),
      cdateNum: date.getTime()
    })
  }))

}

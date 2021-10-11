import { Express2, toCallback } from '../../../_express/express2'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageFileManager } from '../../../../file/fileman'
import { newLimitedNumber } from '../../../../_util/primitive'
import { imageListByCdateService, imageListService } from '../../../../service/image/image-list-service'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { newDate } from '../../../../_util/date2'
import { firstImageCdateService } from '../../../../service/image/image-detail-service'
import { renderJson } from '../../_common/render-json'

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

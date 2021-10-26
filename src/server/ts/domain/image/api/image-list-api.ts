import { imageListByCdateService, imageListService } from '@server/domain/image/_service/image-list-service'
import { Express2, toCallback } from '@server/express/express2'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/express/render-json'
import { newDate } from '@common/util/date2'
import { firstImageCdateService } from '@server/domain/image/_service/image-detail-service'
import { newLimitedNumber } from '@common/util/primitive'

export async function useImageListApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.get('/api/image-list', toCallback(async (req, res) => {
    const p = newLimitedNumber(req.query.p, 1, 1, NaN)
    const ps = newLimitedNumber(req.query.ps, 16, 1, 128)
    const d = newDate(req.query.d)
    const list =d ?
      await imageListByCdateService(udb, idb, ifm, d, p, ps) :
      await imageListService(udb, idb, ifm, p, ps)
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
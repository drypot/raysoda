import { Express2, toCallback } from '../../../_express/express2'
import { ImageDB } from '../../../../db/image/image-db'
import { newLimitedNumber } from '../../../../_util/primitive'
import { imageListByCdateService, imageListService } from '../../../../service/image/image-list-service'
import { newDate } from '../../../../_util/date2'
import { firstImageCdateService } from '../../../../service/image/image-detail-service'
import { renderJson } from '../../_common/render-json'
import { omanGetConfig, omanGetObject } from '../../../../oman/oman'
import { omanGetImageFileManager } from '../../../../file/_fileman-loader'
import { UserDB } from '../../../../db/user/user-db'

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

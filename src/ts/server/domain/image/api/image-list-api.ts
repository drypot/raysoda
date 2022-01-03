import { fillImagePage } from '@server/domain/image/_service/image-list'
import { Express2, toCallback } from '@server/express/express2'
import { omanGetImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { parseDate } from '@common/util/date2'
import { imageGetFirstCdate } from '@server/domain/image/_service/image-detail'
import { newLimitedNumber } from '@common/util/primitive'
import { renderJson } from '@server/express/response'
import { newPageParam } from '@common/type/page'
import { newImagePage } from '@common/type/image-list'

export async function useImageListApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.get('/api/image-list', toCallback(async (req, res) => {
    const page = newImagePage()
    const param = newPageParam()
    param.uid = newLimitedNumber(req.query.uid, 0, 0, NaN)
    param.begin = newLimitedNumber(req.query.pb, 0, 0, NaN)
    param.end = newLimitedNumber(req.query.pe, 0, 0, NaN)
    param.size = newLimitedNumber(req.query.ps, 16, 1, 128)
    param.date = parseDate(req.query.d)
    await fillImagePage(udb, idb, ifm, page, param)
    renderJson(res, {
      list: page.list,
      prev: page.prev,
      next: page.next
    })
  }))

  web.router.get('/api/first-image-cdate', toCallback(async (req, res) => {
    const date = await imageGetFirstCdate(idb)
    renderJson(res, {
      todayNum: Date.now(),
      cdateNum: date.getTime()
    })
  }))

}

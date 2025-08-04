import { getExpress2, toCallback } from '../../../express/express2.ts'
import { getUserDB } from '../../../db/user/user-db.ts'
import { getImageDB } from '../../../db/image/image-db.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { getConfig } from '../../../oman/oman.ts'
import { newImagePage } from '../../../common/type/image-list.ts'
import { newPageParam } from '../../../common/type/page.ts'
import { newLimitedNumber } from '../../../common/util/primitive.ts'
import { parseDate } from '../../../common/util/date2.ts'
import { fillImagePage } from '../service/image-list.ts'
import { renderJson } from '../../../express/response.ts'
import { getFirstImageCdate } from '../service/image-detail.ts'

export async function useImageListApi() {

  const express2 = await getExpress2()
  const udb = await getUserDB()
  const idb = await getImageDB()
  const ifm = await getImageFileManager(getConfig().appNamel)

  express2.router.get('/api/image-list', toCallback(async (req, res) => {
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

  express2.router.get('/api/first-image-cdate', toCallback(async (req, res) => {
    const date = await getFirstImageCdate(idb)
    renderJson(res, {
      todayNum: Date.now(),
      cdateNum: date.getTime()
    })
  }))

}

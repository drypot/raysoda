import { getExpress2, toCallback } from '../../../express/express2.ts'
import { getUserDB } from '../../../db/user/user-db.ts'
import { getImageDB } from '../../../db/image/image-db.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { getConfig, getObject } from '../../../oman/oman.ts'
import { BannerDB } from '../../../db/banner/banner-db.ts'
import { newImagePage } from '../../../common/type/image-list.ts'
import { newPageParam } from '../../../common/type/page.ts'
import { newLimitedNumber } from '../../../common/util/primitive.ts'
import { parseDate } from '../../../common/util/date2.ts'
import { fillImagePage } from '../service/image-list.ts'
import { UrlMaker } from '../../../common/util/url2.ts'
import { renderHtml } from '../../../express/response.ts'
import type { Request, Response } from 'express'

export async function useImageListPage() {

  const express2 = await getExpress2()
  const udb = await getUserDB()
  const idb = await getImageDB()
  const ifm = await getImageFileManager(getConfig().appNamel)
  const bdb = await getObject('BannerDB') as BannerDB

  express2.router.get('/', toCallback(listHandler))

  express2.router.get('/image-list', toCallback(listHandler))

  async function listHandler(req: Request, res: Response) {
    const page = newImagePage()
    const param = newPageParam()
    param.uid = newLimitedNumber(req.query.uid, 0, 0, NaN)
    param.begin = newLimitedNumber(req.query.pb, 0, 0, NaN)
    param.end = newLimitedNumber(req.query.pe, 0, 0, NaN)
    param.size = newLimitedNumber(req.query.ps, 16, 1, 128)
    param.date = parseDate(req.query.d)
    await fillImagePage(udb, idb, ifm, page, param)

    let prevUrl = ''
    let nextUrl = ''
    if (page.prev) {
      const m = UrlMaker.from('/image-list')
      m.add('uid', param.uid, 0)
      m.add('pe', page.prev, null)
      m.add('ps', param.size, 16)
      prevUrl = m.toString()
    }
    if (page.next) {
      const m = UrlMaker.from('/image-list')
      m.add('uid', param.uid, 0)
      m.add('pb', page.next, null)
      m.add('ps', param.size, 16)
      nextUrl = m.toString()
    }

    renderHtml(res, 'image/image-list', {
      list: page.list,
      prev: prevUrl,
      next: nextUrl,
      bannerList: bdb.getCachedBannerList()
    })
  }

  let firstCdate: Date

  express2.router.get('/image-list-by-year', toCallback(async (req, res) => {
    if (!firstCdate) {
      const image = await idb.getFirstImage()
      firstCdate = image ? image.cdate : new Date()
    }
    renderHtml(res, 'image/image-list-by-year', { firstCdate })
  }))

}

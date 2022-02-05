import { fillImagePage } from '@server/domain/image/_service/image-list'
import { parseDate } from '@common/util/date2'
import { renderHtml } from '@server/express/response'
import { Express2, toCallback } from '@server/express/express2'
import { getImageFileManager } from '@server/fileman/_fileman-loader'
import { UrlMaker } from '@common/util/url2'
import { BannerDB } from '@server/db/banner/banner-db'
import { ImageDB } from '@server/db/image/image-db'
import { getConfig, getObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { newLimitedNumber } from '@common/util/primitive'
import { Request, Response } from 'express'
import { newImagePage } from '@common/type/image-list'
import { newPageParam } from '@common/type/page'

export async function useImageListPage() {

  const web = await getObject('Express2') as Express2
  const udb = await getObject('UserDB') as UserDB
  const idb = await getObject('ImageDB') as ImageDB
  const ifm = await getImageFileManager(getConfig().appNamel)
  const bdb = await getObject('BannerDB') as BannerDB

  web.router.get('/', toCallback(listHandler))

  web.router.get('/image-list', toCallback(listHandler))

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

  web.router.get('/image-list-by-year', toCallback(async (req, res) => {
    if (!firstCdate) {
      const image = await idb.getFirstImage()
      firstCdate = image ? image.cdate : new Date()
    }
    renderHtml(res, 'image/image-list-by-year', { firstCdate })
  }))

}

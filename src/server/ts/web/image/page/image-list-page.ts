import { imageListByCdateService, imageListService } from '@server/service/image/image-list-service'
import { newDate, newDateString } from '@common/util/date2'
import { renderHtml } from '@server/web/_common/render-html'
import { Express2, toCallback } from '@server/web/_express/express2'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { UrlMaker } from '@common/util/url2'
import { BannerDB } from '@server/db/banner/banner-db'
import { ImageDB } from '@server/db/image/image-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { newLimitedNumber } from '@common/util/primitive'
import { Request, Response } from 'express'

export async function useImageListPage() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)
  const bdb = await omanGetObject('BannerDB') as BannerDB

  web.router.get('/', toCallback(listHandler))

  web.router.get('/image-list', toCallback(listHandler))

  async function listHandler(req: Request, res: Response) {
    const p = newLimitedNumber(req.query.p, 1, 1, NaN)
    const ps = newLimitedNumber(req.query.ps, 16, 1, 128)
    const d = newDate(req.query.d)
    const ds = newDateString(d)
    const list = d ?
      await imageListByCdateService(udb, idb, ifm, d, p, ps) :
      await imageListService(udb, idb, ifm, p, ps)
    renderHtml(res, 'image/image-list', {
      imageList: list,
      prev: p > 1 ? UrlMaker.from('/image-list').add('d', ds, '').add('p', p - 1, 1).add('ps', ps, 16).toString() : undefined,
      next: list.length === ps ? UrlMaker.from('/image-list').add('d', ds, '').add('p', p + 1).add('ps', ps, 16).toString() : undefined,
      bannerList: bdb.getCached()
    })
  }

  let firstCdate: Date;

  web.router.get('/image-list-by-year', toCallback(async (req, res) => {
    if (!firstCdate) {
      const image = await idb.findFirstImage()
      firstCdate = image ? image.cdate : new Date()
    }
    renderHtml(res, 'image/image-list-by-year', {
      firstCdate: new Date()
    })
  }))

}

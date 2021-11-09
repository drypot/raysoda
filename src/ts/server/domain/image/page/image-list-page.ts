import { imageGetList, imageGetListByCdate } from '@server/domain/image/_service/image-list'
import { dateToStringNoTime, parseDate } from '@common/util/date2'
import { renderHtml } from '@server/express/render-html'
import { Express2, toCallback } from '@server/express/express2'
import { omanGetImageFileManager } from '@server/fileman/_fileman-loader'
import { UrlMaker } from '@common/util/url2'
import { BannerDB } from '@server/db/banner/banner-db'
import { ImageDB } from '@server/db/image/image-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { newLimitedNumber } from '@common/util/primitive'
import { Request, Response } from 'express'
import { ImageForList } from '@common/type/image-detail'

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
    const d = parseDate(req.query.d)
    const ds = dateToStringNoTime(d)
    let list: ImageForList[]
    if (d) {
      list = await imageGetListByCdate(udb, idb, ifm, d, p, ps)
    } else {
      list = await imageGetList(udb, idb, ifm, p, ps)
    }
    renderHtml(res, 'image/image-list', {
      imageList: list,
      prev: p > 1 ? UrlMaker.from('/image-list').add('d', ds, '').add('p', p - 1, 1).add('ps', ps, 16).toString() : undefined,
      next: list.length === ps ? UrlMaker.from('/image-list').add('d', ds, '').add('p', p + 1).add('ps', ps, 16).toString() : undefined,
      bannerList: bdb.getBannerListCached()
    })
  }

  let firstCdate: Date;

  web.router.get('/image-list-by-year', toCallback(async (req, res) => {
    if (!firstCdate) {
      const image = await idb.findFirstImage()
      firstCdate = image ? image.cdate : new Date()
    }
    renderHtml(res, 'image/image-list-by-year', { firstCdate })
  }))

}

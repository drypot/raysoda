import { Express2, renderHtml, toCallback } from '../../_express/express2.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { Request, Response } from 'express'
import { newLimitedNumber } from '../../../_util/primitive.js'
import { newDate, newDateString } from '../../../_util/date2.js'
import { imageListByCdateService, imageListService } from '../../../service/image/image-list-service.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { UrlMaker } from '../../../_util/url2.js'
import { BannerDB } from '../../../db/banner/banner-db.js'

export function registerImageListPage(web: Express2, uc: UserCache, idb: ImageDB, ifm: ImageFileManager, bdb: BannerDB) {

  web.router.get('/', toCallback(listHandler))

  web.router.get('/image-list', toCallback(listHandler))

  async function listHandler(req: Request, res: Response) {
    const p = newLimitedNumber(req.query.p, 1, 1, NaN)
    const ps = newLimitedNumber(req.query.ps, 16, 1, 128)
    const d = newDate(req.query.d)
    const ds = newDateString(d)
    const list = d ?
      await imageListByCdateService(uc, idb, ifm, d, p, ps) :
      await imageListService(uc, idb, ifm, p, ps)
    renderHtml(res, 'image/image-list', {
      imageList: list,
      prev: p > 1 ? UrlMaker.from('/image-list').add('d', ds).add('p', p - 1, 1).add('ps', ps, 16).toString() : undefined,
      next: list.length === ps ? UrlMaker.from('/image-list').add('d', ds).add('p', p + 1).add('ps', ps, 16).toString(): undefined,
      bannerList: bdb.getCached()
    });
  }

}

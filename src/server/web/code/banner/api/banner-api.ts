import { Express2, toCallback } from '../../../_express/express2.js'
import { BannerDB } from '../../../../db/banner/banner-db.js'
import { bannerListService, bannerListUpdateService } from '../../../../service/banner/banner-service.js'
import { Banner } from '../../../../_type/banner.js'
import { getSessionUser } from '../../user-auth/api/user-auth-api.js'
import { renderJson } from '../../_common/render-json.js'
import { shouldBeAdmin, shouldBeUser } from '../../../../service/user-auth/user-auth-service.js'

export function registerBannerApi(web: Express2, bdb: BannerDB) {

  web.router.get('/api/banner-list', toCallback(async (req, res) => {
    const bannerList = bannerListService(bdb)
    renderJson(res, { bannerList })
  }))

  web.router.put('/api/banner-update', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    await bannerListUpdateService(bdb, req.body.banner as Banner[])
    renderJson(res, {})
  }))

}

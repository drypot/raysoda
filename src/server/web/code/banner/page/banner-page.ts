import { Express2, toCallback } from '../../../_express/express2.js'
import { BannerDB } from '../../../../db/banner/banner-db.js'
import { getSessionUser } from '../../user-auth/api/user-auth-api.js'
import { renderHtml } from '../../_common/render-html.js'
import { shouldBeAdmin, shouldBeUser } from '../../../../service/user-auth/user-auth-service.js'

export function registerBannerPage(web: Express2, bdb: BannerDB) {

  web.router.get('/banner-update', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    const bannerList = bdb.getCached()
    renderHtml(res, 'banner/banner-update', { bannerList })
  }))

}

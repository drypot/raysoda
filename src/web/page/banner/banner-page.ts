import { Express2, toCallback } from '../../_express/express2.js'
import { BannerDB } from '../../../db/banner/banner-db.js'
import { getSessionUser, shouldBeAdmin, shouldBeUser } from '../../api/user-login/login-api.js'

export function registerBannerPage(web: Express2, bdb: BannerDB) {

  web.router.get('/banner-update', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    const bannerList = bdb.getCached()
    res.render('banner/banner-update', { bannerList })
  }))

}

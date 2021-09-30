import { Express2, toCallback } from '../../_express/express2.js'
import { loginUserFrom } from '../../api/user-login/login-api.js'
import { BannerDB } from '../../../db/banner/banner-db.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../_type/error-user.js'

export function registerBannerPage(web: Express2, bdb: BannerDB) {

  const router = web.router

  router.get('/banner-update', toCallback(async (req, res) => {
    const user = loginUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    if (!user.admin) throw NOT_AUTHORIZED
    const banner = await bdb.getBanner()
    res.render('banner/banner-update', { banner })
  }))

}

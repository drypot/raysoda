import { Express2, toCallback } from '../_express/express2.js'
import { sessionUserFrom } from '../user-login/login-api.js'
import { BannerDB } from '../../db/banner/banner-db.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../_error/error-user.js'

export function registerBannerPage(web: Express2, bdb: BannerDB) {

  const router = web.router

  router.get('/banner-update', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    if (!user.admin) throw NOT_AUTHORIZED
    const banner = await bdb.getBanner()
    res.render('banner/pug/banner-update', { banner })
  }))

}

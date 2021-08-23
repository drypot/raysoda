import { Express2, toCallback } from '../../_express/express2.js'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../service/user/form/user-form.js'
import { sessionUserFrom } from '../../api/user/user-login-api.js'
import { BannerDB } from '../../../db/banner/banner-db.js'

export function registerBannerView(web: Express2, bdb: BannerDB) {

  const router = web.router

  router.get('/support/banner', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    if (!user.admin) throw NOT_AUTHORIZED
    const banner = await bdb.getBanner()
    res.render('banner/banner-view', { banner })
  }))

}

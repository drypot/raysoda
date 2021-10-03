import { Express2, toCallback } from '../../_express/express2.js'
import { getUser, shouldBeAdmin, shouldBeUser } from '../user-login/login-api.js'
import { BannerDB } from '../../../db/banner/banner-db.js'

export function registerBannerApi(web: Express2, bdb: BannerDB) {
  web.router.get('/api/banner-list', toCallback(async (req, res) => {
    const bannerList = bdb.getBannerList()
    res.json({ bannerList })
  }))

  web.router.put('/api/banner-update', toCallback(async (req, res) => {
    const user = getUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    await bdb.setBannerList(req.body.banner)
    res.json({})
  }))
}

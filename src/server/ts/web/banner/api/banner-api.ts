import { Express2, toCallback } from '@server/web/_express/express2'
import { getSessionUser } from '@server/web/user-auth/api/user-auth-api'
import { shouldBeAdmin, shouldBeUser } from '@server/service/user-auth/user-auth-service'
import { BannerDB } from '@server/db/banner/banner-db'
import { Banner } from '@common/type/banner'
import { bannerListService, bannerListUpdateService } from '@server/service/banner/banner-service'
import { omanGetObject } from '@server/oman/oman'
import { renderJson } from '@server/web/_common/render-json'

export async function useBannerApi() {

  const web = await omanGetObject('Express2') as Express2
  const bdb = await omanGetObject('BannerDB') as BannerDB

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

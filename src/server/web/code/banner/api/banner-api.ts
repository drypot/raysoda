import { Express2, toCallback } from '../../../_express/express2'
import { BannerDB } from '../../../../db/banner/banner-db'
import { bannerListService, bannerListUpdateService } from '../../../../service/banner/banner-service'
import { Banner } from '../../../../_type/banner'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { renderJson } from '../../_common/render-json'
import { shouldBeAdmin, shouldBeUser } from '../../../../service/user-auth/user-auth-service'
import { omanGetObject } from '../../../../oman/oman'

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

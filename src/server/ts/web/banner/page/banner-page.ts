import { Express2, toCallback } from '@server/web/_express/express2'
import { getSessionUser } from '@server/web/user/api/user-auth-api'
import { shouldBeAdmin, shouldBeUser } from '@server/service/user-auth/user-auth-service'
import { BannerDB } from '@server/db/banner/banner-db'
import { renderHtml } from '@server/web/_common/render-html'
import { omanGetObject } from '@server/oman/oman'

export async function useBannerPage() {

  const web = await omanGetObject('Express2') as Express2
  const bdb = await omanGetObject('BannerDB') as BannerDB

  web.router.get('/banner-update', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    shouldBeAdmin(user)
    const bannerList = bdb.getCached()
    renderHtml(res, 'banner/banner-update', { bannerList })
  }))

}

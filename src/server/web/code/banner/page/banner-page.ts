import { Express2, toCallback } from '../../../_express/express2'
import { BannerDB } from '../../../../db/banner/banner-db'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { renderHtml } from '../../_common/render-html'
import { shouldBeAdmin, shouldBeUser } from '../../../../service/user-auth/user-auth-service'
import { omanGetObject } from '../../../../oman/oman'

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

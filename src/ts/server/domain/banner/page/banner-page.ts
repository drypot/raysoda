import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { assertAdmin, assertLoggedIn } from '@server/domain/user/_service/user-auth'
import { BannerDB } from '@server/db/banner/banner-db'
import { renderHtml } from '@server/express/response'
import { omanGetObject } from '@server/oman/oman'

export async function useBannerPage() {

  const web = await omanGetObject('Express2') as Express2
  const bdb = await omanGetObject('BannerDB') as BannerDB

  web.router.get('/banner-update', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    assertAdmin(user)
    const list = bdb.getCachedBannerList()
    renderHtml(res, 'banner/banner-update', { form: { bannerList: list } })
  }))

}

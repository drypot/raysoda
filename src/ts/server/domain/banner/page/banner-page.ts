import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { userAssertAdmin, userAssertLogin } from '@server/domain/user/_service/user-auth'
import { BannerDB } from '@server/db/banner/banner-db'
import { renderHtml } from '@server/express/respose'
import { omanGetObject } from '@server/oman/oman'

export async function useBannerPage() {

  const web = await omanGetObject('Express2') as Express2
  const bdb = await omanGetObject('BannerDB') as BannerDB

  web.router.get('/banner-update', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    userAssertAdmin(user)
    const list = bdb.getBannerListCached()
    renderHtml(res, 'banner/banner-update', { form: { bannerList: list } })
  }))

}

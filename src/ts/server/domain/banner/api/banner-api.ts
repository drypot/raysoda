import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { userAssertAdmin, userAssertLogin } from '@server/domain/user/_service/user-auth'
import { BannerDB } from '@server/db/banner/banner-db'
import { Banner } from '@common/type/banner'
import { bannerGetList, bannerUpdate } from '@server/domain/banner/_service/banner-service'
import { omanGetObject } from '@server/oman/oman'
import { renderJson } from '@server/express/render-json'

export async function useBannerApi() {

  const web = await omanGetObject('Express2') as Express2
  const bdb = await omanGetObject('BannerDB') as BannerDB

  web.router.get('/api/banner-list', toCallback(async (req, res) => {
    const list = bannerGetList(bdb)
    renderJson(res, { bannerList: list })
  }))

  web.router.put('/api/banner-update', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    userAssertAdmin(user)
    await bannerUpdate(bdb, req.body.banner as Banner[])
    renderJson(res, {})
  }))

}

import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { assertAdmin, assertLoggedIn } from '@server/domain/user/_service/user-auth'
import { BannerDB } from '@server/db/banner/banner-db'
import { Banner } from '@common/type/banner'
import { getBannerList, updateBannerList } from '@server/domain/banner/_service/banner-service'
import { getObject } from '@server/oman/oman'
import { renderJson } from '@server/express/response'

export async function useBannerApi() {

  const web = await getObject('Express2') as Express2
  const bdb = await getObject('BannerDB') as BannerDB

  web.router.get('/api/banner-list', toCallback(async (req, res) => {
    const list = getBannerList(bdb)
    renderJson(res, { bannerList: list })
  }))

  web.router.put('/api/banner-update', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    assertAdmin(user)
    await updateBannerList(bdb, req.body.bannerList as Banner[])
    renderJson(res, {})
  }))

}

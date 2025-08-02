import { getBannerDB } from '../../../db/banner/banner-db.js'
import { getExpress2, toCallback } from '../../../express/express2.js'
import { getBannerList, updateBannerList } from '../service/banner-service.js'
import { renderJson } from '../../../express/response.js'
import { userGetSessionUser } from '../../user/api/user-auth-api.js'
import { assertAdmin, assertLoggedIn } from '../../user/service/user-auth.js'
import { Banner } from '../../../common/type/banner.js'

export async function useBannerApi() {

  const express2 = await getExpress2()
  const bdb = await getBannerDB()

  express2.router.get('/api/banner-list', toCallback(async (req, res) => {
    const list = getBannerList(bdb)
    renderJson(res, { bannerList: list })
  }))

  express2.router.put('/api/banner-update', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    assertAdmin(user)
    await updateBannerList(bdb, req.body.bannerList as Banner[])
    renderJson(res, {})
  }))

}

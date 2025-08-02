import { getExpress2, toCallback } from '../../../express/express2.js'
import { getObject } from '../../../oman/oman.js'
import { BannerDB } from '../../../db/banner/banner-db.js'
import { userGetSessionUser } from '../../user/api/user-auth-api.js'
import { assertAdmin, assertLoggedIn } from '../../user/service/user-auth.js'
import { renderHtml } from '../../../express/response.js'

export async function useBannerPage() {

  const express2 = await getExpress2()
  const bdb = await getObject('BannerDB') as BannerDB

  express2.router.get('/banner-update', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    assertAdmin(user)
    const list = bdb.getCachedBannerList()
    renderHtml(res, 'banner/banner-update', { form: { bannerList: list } })
  }))

}

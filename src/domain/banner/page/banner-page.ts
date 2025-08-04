import { getExpress2, toCallback } from '../../../express/express2.ts'
import { getObject } from '../../../oman/oman.ts'
import { BannerDB } from '../../../db/banner/banner-db.ts'
import { userGetSessionUser } from '../../user/api/user-auth-api.ts'
import { assertAdmin, assertLoggedIn } from '../../user/service/user-auth.ts'
import { renderHtml } from '../../../express/response.ts'

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

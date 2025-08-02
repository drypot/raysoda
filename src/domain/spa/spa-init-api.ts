import { getConfig } from '../../oman/oman.js'
import { getExpress2 } from '../../express/express2.js'
import { getBannerDB } from '../../db/banner/banner-db.js'
import { newConfigForClient } from '../../common/type/config.js'
import { userGetSessionUser } from '../user/api/user-auth-api.js'
import { newUserIdCard } from '../../common/type/user.js'

export async function useSpaInitApi() {

  const config = getConfig()
  const express2 = await getExpress2()
  const bdb = await getBannerDB()

  const configStr = JSON.stringify(newConfigForClient(config))

  // nginx 설정 편의를 위해 /api 아래에 둔다.
  express2.router.get('/api/spa-init-script', function (req, res) {
    const user = userGetSessionUser(res)
    const userStr = JSON.stringify(newUserIdCard(user))
    const bannerStr = JSON.stringify(bdb.getCachedBannerList())
    const script =
      `const _config = ${configStr}\n` +
      `const _user = ${userStr}\n` +
      `const _banner = ${bannerStr}\n`
    res.type('.js')
    res.send(script)
  })

}

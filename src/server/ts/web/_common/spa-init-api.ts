import { Express2 } from '@server/web/_express/express2'
import { getSessionUser } from '@server/web/user-auth/api/user-auth-api'
import { newUserIdCard } from '@common/type/user'
import { BannerDB } from '@server/db/banner/banner-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { newConfigForClient } from '@common/type/config'

export async function useSpaInitApi() {

  const config = omanGetConfig()
  const web = await omanGetObject('Express2') as Express2
  const bdb = await omanGetObject('BannerDB') as BannerDB

  const configStr = JSON.stringify(newConfigForClient(config))

  // nginx 설정 편의를 위해 /api 아래에 둔다.
  web.router.get('/api/spa-init-script', function (req, res) {
    const user = getSessionUser(res)
    const userStr = JSON.stringify(newUserIdCard(user))
    const bannerStr = JSON.stringify(bdb.getCached())
    const script =
      `const _config = ${configStr}\n` +
      `const _user = ${userStr}\n` +
      `const _banner = ${bannerStr}\n`
    res.type('.js')
    res.send(script)
  })

}

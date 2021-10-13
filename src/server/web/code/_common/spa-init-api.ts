import { Express2 } from '../../_express/express2'
import { BannerDB } from '../../../db/banner/banner-db'
import { newConfigForClient } from '../../../_type/config'
import { getSessionUser } from '../user-auth/api/user-auth-api'
import { newUserIdCard } from '../../../_type/user'
import { omanGetConfig, omanGetObject } from '../../../oman/oman'

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

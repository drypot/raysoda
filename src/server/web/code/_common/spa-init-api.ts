import { Express2 } from '../../_express/express2'
import { BannerDB } from '../../../db/banner/banner-db'
import { newConfigForClient } from '../../../_type/config'
import { getSessionUser } from '../user-auth/api/user-auth-api'
import { newUserIdCard } from '../../../_type/user'
import { INVALID_DATA } from '../../../_type/error'
import { inDev } from '../../../_util/env2'

export function registerSpaInitApi(web: Express2, bdb: BannerDB) {

  const configStr = JSON.stringify(newConfigForClient(web.config))

  // nginx 설정 편의를 위해 /api 아래에 둔다.
  web.router.get('/api/spa-init-script', function (req, res) {
    const user = getSessionUser(res)
    const userStr = JSON.stringify(newUserIdCard(user))
    const bannerStr = JSON.stringify(bdb.getCached())
    const script =
      `const _config = ${configStr}\n` +
      `const _user = ${userStr}\n` +
      `const _banner = ${bannerStr}\n`
    res.type('')
    res.send(script)
  })

  if (inDev()) {
    web.router.get('/error', function (req, res) {
      throw new Error()
    })

    web.router.get('/invalid-data', function (req, res) {
      throw INVALID_DATA
    })
  }

}

import { Express2, toCallback } from '../../_express/express2.js'
import { BannerDB } from '../../../db/banner/banner-db.js'
import { Config, newConfigForClient } from '../../../_type/config.js'
import { newUserForClient } from '../../../_type/user-client.js'
import { getSessionUser } from '../../api/user-login/login-api.js'
import { User } from '../../../_type/user.js'

type ResLocals = {
  config: Config
  user: User
}

export function registerPageSupport(web: Express2, bdb: BannerDB) {

  const configStr = JSON.stringify(newConfigForClient(web.config))
  web.express.locals.config = web.config

  web.router.get('/spa-init-script', toCallback(async function (req, res) {
    const user = getSessionUser(res)
    const userStr = JSON.stringify(newUserForClient(user))
    const bannerStr = JSON.stringify(bdb.getCached())
    const script =
      `const _config = ${configStr}\n` +
      `const _user = ${userStr}\n` +
      `const _banner = ${bannerStr}\n`
    res.type('.js')
    res.send(script)
  }))

}

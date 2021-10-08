import { Express2, renderHtml } from '../../_express/express2.js'
import { BannerDB } from '../../../db/banner/banner-db.js'
import { Config, newConfigForClient } from '../../../_type/config.js'
import { getSessionUser } from '../../api/user-login/login-api.js'
import { newUserIdCard, User } from '../../../_type/user.js'

type ResLocals = {
  config: Config
  user: User
}

export function registerPageSupport(web: Express2, bdb: BannerDB) {

  const configStr = JSON.stringify(newConfigForClient(web.config))

  web.router.get('/spa-init-script', function (req, res) {
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

  web.router.get('/error', function (req, res) {
    renderHtml(res, '_page/error', { err: [new Error] })
  })

}


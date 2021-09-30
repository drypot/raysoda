import { Express2, toCallback } from '../../_express/express2.js'
import { BannerDB } from '../../../db/banner/banner-db.js'
import { userMinOf } from '../../../_type/user.js'
import { configMinOf } from '../../../_type/config.js'

export function registerSessionInitScript(web: Express2, bdb: BannerDB) {

  web.router.get('/api/client-init-script', toCallback(async function (req, res) {
    const configStr = JSON.stringify(configMinOf(web.config))
    const userStr = JSON.stringify(res.locals.user ? userMinOf(res.locals.user) : null)
    const bannerStr = JSON.stringify(await bdb.getBanner())
    const script =
      `const _config = ${configStr}\n` +
      `const _user = ${userStr}\n` +
      `const _banner = ${bannerStr}\n`
    res.type('.js')
    res.send(script)
  }))

}

import { Express2, toCallback } from '../_express/express2.js'
import { BannerDB } from '../../db/banner/banner-db.js'

export function registerSessionInitScript(web: Express2, bdb: BannerDB) {

  web.router.get('/api/session-init-script', toCallback(async function (req, res) {
    const config = web.config
    const user = res.locals.user
    const userString = JSON.stringify(user ? { id: user.id, name: user.name, home: user.home } : null)
    const banner = await bdb.getBanner()
    const bannerString = JSON.stringify(banner)
    const script =
      `const _config = {}\n` +
      `_config.appName = '${config.appName}'\n` +
      `_config.appNamel = '${config.appNamel}'\n` +
      `_config.appDesc = '${config.appDesc}'\n` +
      `_config.mainUrl = '${config.mainUrl}'\n` +
      `_config.uploadUrl = '${config.uploadUrl}'\n` +
      `const _user = ${userString}\n` +
      `const _banner = ${bannerString}\n`
    res.type('.js')
    res.send(script)
  }))

}

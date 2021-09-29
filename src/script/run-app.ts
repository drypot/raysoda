import { Express2 } from '../web/_express/express2.js'
import { configFrom } from '../_config/config.js'
import { DB } from '../db/_db/db.js'
import { UserDB } from '../db/user/user-db.js'
import { ImageDB } from '../db/image/image-db.js'
import { RaySodaFileManager } from '../file/raysoda-fileman.js'
import { registerUserLoginApi } from '../web/user/user-login-api.js'
import { registerImageUploadApi } from '../web/image/image-upload-api.js'
import { registerImageUpdateApi } from '../web/image/image-update-api.js'
import { ValueDB } from '../db/value/value-db.js'
import { logError } from '../_error/error2.js'
import { RapixelFileManager } from '../file/rapixel-fileman.js'
import { OsokyFileManager } from '../file/osoky-fileman.js'
import { DrypotFileManager } from '../file/drypot-fileman.js'
import { registerUserXPage } from '../web/userx/userx-page.js'
import { registerUserViewApi } from '../web/user/user-detail-api.js'
import { registerUserRegisterApi } from '../web/user/user-register-api.js'
import { registerPwResetApi } from '../web/user/user-pwreset-api.js'
import { PwResetDB } from '../db/pwreset/pwreset-db.js'
import { Mailer } from '../mailer/mailer2.js'
import { registerUserDeactivateApi } from '../web/user/user-deactivate-api.js'
import { registerUserListApi } from '../web/user/user-list-api.js'
import { registerUserUpdateApi } from '../web/user/user-update-api.js'
import { registerRedirect } from '../web/aux/redirect.js'
import { registerImageDeleteApi } from '../web/image/image-delete-api.js'
import { registerImageListApi } from '../web/image/image-list-api.js'
import { registerImageViewApi } from '../web/image/image-detail-api.js'
import { registerCounterApi } from '../web/counter/counter-api.js'
import { CounterDB } from '../db/counter/counter-db.js'
import { registerBannerApi } from '../web/banner/banner-api.js'
import { BannerDB } from '../db/banner/banner-db.js'
import { registerAboutPage } from '../web/about/about-page.js'
import { registerSessionInitScript } from '../web/aux/session-init-script.js'

async function main() {
  const config = configFrom(process.argv[2])

  const db = await DB.from(config).createDatabase()
  const vdb = await ValueDB.from(db).createTable()
  const udb = await UserDB.from(db).createTable()
  const rdb = await PwResetDB.from(db).createTable()
  const idb = await ImageDB.from(db).createTable()
  const cdb = await CounterDB.from(db).createTable()
  const bdb = BannerDB.from(vdb)

  const ifm =
    config.appNamel === 'rapixel' ? RapixelFileManager.from(config) :
      config.appNamel === 'osoky' ? OsokyFileManager.from(config) :
        config.appNamel === 'drypot' ? DrypotFileManager.from(config) :
          RaySodaFileManager.from(config)

  const mailer = Mailer.from(config).initTransport()

  const web = Express2.from(config).useUpload()

  registerImageUploadApi(web, udb, idb, ifm)
  registerImageViewApi(web, udb, idb, ifm)
  registerImageListApi(web, udb, idb, ifm)
  registerImageUpdateApi(web, idb, ifm)
  registerImageDeleteApi(web, idb, ifm)

  registerUserLoginApi(web, udb)
  registerUserRegisterApi(web, udb)
  registerUserViewApi(web, udb)
  registerUserUpdateApi(web, udb)
  registerUserDeactivateApi(web, udb)
  registerUserListApi(web, udb)
  registerPwResetApi(web, udb, rdb, mailer)

  registerAboutPage(web)
  registerCounterApi(web, cdb)
  registerBannerApi(web, bdb)

  registerSessionInitScript(web, bdb)
  registerRedirect(web)

  registerUserXPage(web, udb, idb, ifm)

  async function closeAll() {
    await web.close()
    await db.close()
  }

  process.on('uncaughtException', function (err) {
    console.error(err.stack)
    process.exit(1)
  })

  process.on('SIGINT', function () {
    closeAll().then(() => {
      console.log('SIGINT caught')
      process.exit(1)
    })
  })

  web.start().then(() => {
    //console.log(config)
    console.log('server started.')
    console.log('http://localhost:' + config.port)
    console.log(config.mainUrl)
  })
}

main().catch(err => {
  logError(err)
})
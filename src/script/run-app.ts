import { Express2 } from '../web/_express/express2.js'
import { loadConfigSync } from '../_util/config-loader.js'
import { DB } from '../db/_db/db.js'
import { UserDB } from '../db/user/user-db.js'
import { ImageDB } from '../db/image/image-db.js'
import { RaySodaFileManager } from '../file/raysoda-fileman.js'
import { registerLoginApi } from '../web/api/user-login/login-api.js'
import { registerImageUploadApi } from '../web/api/image/image-upload-api.js'
import { registerImageUpdateApi } from '../web/api/image/image-update-api.js'
import { ValueDB } from '../db/value/value-db.js'
import { logError } from '../_util/error2.js'
import { RapixelFileManager } from '../file/rapixel-fileman.js'
import { OsokyFileManager } from '../file/osoky-fileman.js'
import { DrypotFileManager } from '../file/drypot-fileman.js'
import { registerUserProfilePage } from '../web/page/user-profile/profile-page.js'
import { registerUserDetailApi } from '../web/api/user/user-detail-api.js'
import { registerUserRegisterApi } from '../web/api/user/user-register-api.js'
import { registerPasswordApi } from '../web/api/user-password/password-api.js'
import { ResetDB } from '../db/password/reset-db.js'
import { Mailer } from '../mailer/mailer2.js'
import { registerUserDeactivateApi } from '../web/api/user/user-deactivate-api.js'
import { registerUserListApi } from '../web/api/user/user-list-api.js'
import { registerUserUpdateApi } from '../web/api/user/user-update-api.js'
import { registerRedirect } from '../web/page/redirect/redirect.js'
import { registerImageDeleteApi } from '../web/api/image/image-delete-api.js'
import { registerImageListApi } from '../web/api/image/image-list-api.js'
import { registerImageDetailApi } from '../web/api/image/image-detail-api.js'
import { registerCounterApi } from '../web/api/counter/counter-api.js'
import { CounterDB } from '../db/counter/counter-db.js'
import { registerBannerApi } from '../web/api/banner/banner-api.js'
import { BannerDB } from '../db/banner/banner-db.js'
import { registerAboutPage } from '../web/page/about/about-page.js'
import { registerPageSupport } from '../web/page/_page/page.js'
import { UserCache } from '../db/user/cache/user-cache.js'
import { registerBannerPage } from '../web/page/banner/banner-page.js'
import { registerCounterPage } from '../web/page/counter/counter-page.js'
import { registerImageDetailPage } from '../web/page/image/image-detail-page.js'
import { registerImageListPage } from '../web/page/image/image-list-page.js'
import { registerImageUpdatePage } from '../web/page/image/image-update-page.js'
import { registerImageUploadPage } from '../web/page/image/image-upload-page.js'
import { registerUserDeactivatePage } from '../web/page/user/user-deactivate-page.js'
import { registerUserListPage } from '../web/page/user/user-list-page.js'
import { registerUserRegisterPage } from '../web/page/user/user-register-page.js'
import { registerUserUpdatePage } from '../web/page/user/user-update-page.js'
import { registerLoginPage } from '../web/page/user-login/login-page.js'
import { registerPasswordPage } from '../web/page/user-password/password-page.js'

async function main() {
  const config = loadConfigSync(process.argv[2])

  const db = await DB.from(config).createDatabase()
  const vdb = await ValueDB.from(db).createTable()
  const udb = await UserDB.from(db).createTable()
  const uc: UserCache = UserCache.from(udb)
  const rdb = await ResetDB.from(db).createTable()
  const idb = await ImageDB.from(db).createTable()
  const cdb = await CounterDB.from(db).createTable()
  const bdb = await BannerDB.from(vdb).loadCache()

  const ifm =
    config.appNamel === 'rapixel' ? RapixelFileManager.from(config) :
      config.appNamel === 'osoky' ? OsokyFileManager.from(config) :
        config.appNamel === 'drypot' ? DrypotFileManager.from(config) :
          RaySodaFileManager.from(config)

  const mailer = Mailer.from(config).loadSync()

  const web = Express2.from(config).useUpload()

  registerImageListApi(web, uc, idb, ifm)
  registerImageDetailApi(web, uc, idb, ifm)
  registerImageUploadApi(web, udb, idb, ifm)
  registerImageUpdateApi(web, idb, ifm)
  registerImageDeleteApi(web, idb, ifm)

  registerLoginApi(web, uc)
  registerUserRegisterApi(web, udb)
  registerUserDetailApi(web, uc)
  registerUserUpdateApi(web, uc)
  registerUserDeactivateApi(web, uc)
  registerUserListApi(web, udb)
  registerPasswordApi(web, uc, rdb, mailer)

  registerCounterApi(web, cdb)
  registerBannerApi(web, bdb)

  registerPageSupport(web, bdb)

  registerImageListPage(web, uc, idb, ifm, bdb)
  registerImageDetailPage(web, uc, idb, ifm)
  registerImageUpdatePage(web, idb)
  registerImageUploadPage(web, idb)
  registerUserProfilePage(web, uc, idb, ifm)

  registerLoginPage(web)
  registerPasswordPage(web)
  registerUserDeactivatePage(web)
  registerUserListPage(web, udb)
  registerUserRegisterPage(web)
  registerUserUpdatePage(web, uc)

  registerCounterPage(web, cdb)
  registerBannerPage(web, bdb)
  registerAboutPage(web)

  registerRedirect(web)

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
      console.log('\nSIGINT caught')
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

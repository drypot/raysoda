import { Express2 } from '../web/_express/express2'
import { loadConfigSync } from '../_util/config-loader'
import { DB } from '../db/_db/db'
import { UserDB } from '../db/user/user-db'
import { ImageDB } from '../db/image/image-db'
import { RaySodaFileManager } from '../file/raysoda-fileman'
import { registerUserAuthApi } from '../web/code/user-auth/api/user-auth-api'
import { registerImageUploadApi } from '../web/code/image/api/image-upload-api'
import { registerImageUpdateApi } from '../web/code/image/api/image-update-api'
import { ValueDB } from '../db/value/value-db'
import { logError } from '../_util/error2'
import { RapixelFileManager } from '../file/rapixel-fileman'
import { OsokyFileManager } from '../file/osoky-fileman'
import { DrypotFileManager } from '../file/drypot-fileman'
import { registerUserProfilePage } from '../web/code/user-profile/profile-page'
import { registerUserDetailApi } from '../web/code/user/api/user-detail-api'
import { registerUserRegisterApi } from '../web/code/user/api/user-register-api'
import { registerUserPasswordApi } from '../web/code/user-auth/api/user-password-api'
import { ResetDB } from '../db/password/reset-db'
import { Mailer } from '../mailer/mailer2'
import { registerUserDeactivateApi } from '../web/code/user/api/user-deactivate-api'
import { registerUserListApi } from '../web/code/user/api/user-list-api'
import { registerUserUpdateApi } from '../web/code/user/api/user-update-api'
import { registerRedirect } from '../web/code/redirect/redirect'
import { registerImageDeleteApi } from '../web/code/image/api/image-delete-api'
import { registerImageListApi } from '../web/code/image/api/image-list-api'
import { registerImageDetailApi } from '../web/code/image/api/image-detail-api'
import { registerCounterApi } from '../web/code/counter/api/counter-api'
import { CounterDB } from '../db/counter/counter-db'
import { registerBannerApi } from '../web/code/banner/api/banner-api'
import { BannerDB } from '../db/banner/banner-db'
import { registerAboutPage } from '../web/code/about/page/about-page'
import { registerSpaInitApi } from '../web/code/_common/spa-init-api'
import { UserCache } from '../db/user/cache/user-cache'
import { registerBannerPage } from '../web/code/banner/page/banner-page'
import { registerCounterPage } from '../web/code/counter/page/counter-page'
import { registerImageDetailPage } from '../web/code/image/page/image-detail-page'
import { registerImageListPage } from '../web/code/image/page/image-list-page'
import { registerImageUpdatePage } from '../web/code/image/page/image-update-page'
import { registerImageUploadPage } from '../web/code/image/page/image-upload-page'
import { registerUserDeactivatePage } from '../web/code/user/page/user-deactivate-page'
import { registerUserListPage } from '../web/code/user/page/user-list-page'
import { registerUserRegisterPage } from '../web/code/user/page/user-register-page'
import { registerUserUpdatePage } from '../web/code/user/page/user-update-page'
import { registerUserAuthPage } from '../web/code/user-auth/page/user-auth-page'
import { registerUserPasswordPage } from '../web/code/user-auth/page/user-password-page'
import { inDev } from '../_util/env2'
import { registerDevUtilPage } from '../web/code/_common/dev-util-page'

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
  web.logError = inDev()

  registerImageListApi(web, uc, idb, ifm)
  registerImageDetailApi(web, uc, idb, ifm)
  registerImageUploadApi(web, udb, idb, ifm)
  registerImageUpdateApi(web, idb, ifm)
  registerImageDeleteApi(web, idb, ifm)

  registerUserAuthApi(web, uc)
  registerUserRegisterApi(web, udb)
  registerUserDetailApi(web, uc)
  registerUserUpdateApi(web, uc)
  registerUserDeactivateApi(web, uc)
  registerUserListApi(web, udb)
  registerUserPasswordApi(web, uc, rdb, mailer)

  registerCounterApi(web, cdb)
  registerBannerApi(web, bdb)

  registerSpaInitApi(web, bdb)

  registerImageListPage(web, uc, idb, ifm, bdb)
  registerImageDetailPage(web, uc, idb, ifm)
  registerImageUpdatePage(web, idb)
  registerImageUploadPage(web, idb)
  registerUserProfilePage(web, uc, idb, ifm)

  registerUserAuthPage(web)
  registerUserPasswordPage(web)
  registerUserDeactivatePage(web)
  registerUserListPage(web, udb)
  registerUserRegisterPage(web)
  registerUserUpdatePage(web, uc)

  registerCounterPage(web, cdb)
  registerBannerPage(web, bdb)
  registerAboutPage(web)

  registerDevUtilPage(web)

  registerRedirect(web, uc)

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

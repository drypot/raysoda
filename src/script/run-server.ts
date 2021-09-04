import { Express2 } from '../web/_express/express2.js'
import { configFrom } from '../config/config.js'
import { DB } from '../db/_db/db.js'
import { UserDB } from '../db/user/user-db.js'
import { ImageDB } from '../db/image/image-db.js'
import { RaySodaFileManager } from '../file/raysoda-fileman.js'
import { registerUserLoginApi } from '../web/user/user-login-api.js'
import { registerImageUploadApi } from '../web/image/image-upload-api.js'
import { registerImageUpdateApi } from '../web/image/image-update-api.js'
import { ValueDB } from '../db/value/value-db.js'
import { logError } from '../lib/base/error2.js'
import { RapixelFileManager } from '../file/rapixel-fileman.js'
import { OsokyFileManager } from '../file/osoky-fileman.js'
import { DrypotFileManager } from '../file/drypot-fileman.js'
import { registerUserXApi } from '../web/userx/userx-view.js'
import { registerUserViewApi } from '../web/user/user-view-api.js'
import { registerUserRegisterApi } from '../web/user/user-register-api.js'
import { registerPwResetApi } from '../web/user/pwreset-api.js'
import { PwResetDB } from '../db/pwreset/pwreset-db.js'
import { Mailer } from '../lib/mailer/mailer2.js'
import { registerUserDeactivateApi } from '../web/user/user-deactivate-api.js'
import { registerUserListApi } from '../web/user/user-list-api.js'
import { registerUserUpdateApi } from '../web/user/user-update-api.js'
import { registerRedirect } from '../web/redirect/redirect.js'
import { registerImageDeleteApi } from '../web/image/image-delete-api.js'
import { registerImageListApi } from '../web/image/image-list-api.js'
import { registerImageViewApi } from '../web/image/image-view-api.js'
import { registerCounterApi } from '../web/counter/counter-api.js'
import { CounterDB } from '../db/counter/counter-db.js'
import { registerBannerApi } from '../web/banner/banner-api.js'
import { BannerDB } from '../db/banner/banner-db.js'
import { registerAboutApi } from '../web/about/about-api.js'

async function main() {
  const config = configFrom(process.argv[2])

  const db = await DB.from(config).createDatabase()
  const vdb = ValueDB.from(db)
  const udb = UserDB.from(db)
  const rdb = PwResetDB.from(db)
  const idb = ImageDB.from(db)
  const cdb = CounterDB.from(db)
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

  registerAboutApi(web)
  registerCounterApi(web, cdb)
  registerBannerApi(web, bdb)
  registerRedirect(web)

  registerUserXApi(web, udb, idb, ifm)

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
    console.log(config.mainUrl)
  })
}

main().catch(err => {
  logError(err)
})

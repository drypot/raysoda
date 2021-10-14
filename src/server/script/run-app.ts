import { Express2 } from '../web/_express/express2'
import { useUserAuthApi } from '../web/user-auth/api/user-auth-api'
import { useImageUploadApi } from '../web/image/api/image-upload-api'
import { useImageUpdateApi } from '../web/image/api/image-update-api'
import { logError } from '../_util/error2'
import { useUserProfilePage } from '../web/user-profile/profile-page'
import { useUserDetailApi } from '../web/user/api/user-detail-api'
import { useUserRegisterApi } from '../web/user/api/user-register-api'
import { useUserPasswordApi } from '../web/user-auth/api/user-password-api'
import { useUserDeactivateApi } from '../web/user/api/user-deactivate-api'
import { useUserListApi } from '../web/user/api/user-list-api'
import { useUserUpdateApi } from '../web/user/api/user-update-api'
import { useRedirect } from '../web/redirect/redirect'
import { useImageDeleteApi } from '../web/image/api/image-delete-api'
import { useImageListApi } from '../web/image/api/image-list-api'
import { useImageDetailApi } from '../web/image/api/image-detail-api'
import { useCounterApi } from '../web/counter/api/counter-api'
import { useBannerApi } from '../web/banner/api/banner-api'
import { useAboutPage } from '../web/about/page/about-page'
import { useSpaInitApi } from '../web/_common/spa-init-api'
import { useBannerPage } from '../web/banner/page/banner-page'
import { useCounterPage } from '../web/counter/page/counter-page'
import { useImageDetailPage } from '../web/image/page/image-detail-page'
import { useImageListPage } from '../web/image/page/image-list-page'
import { useImageUpdatePage } from '../web/image/page/image-update-page'
import { useImageUploadPage } from '../web/image/page/image-upload-page'
import { useUserDeactivatePage } from '../web/user/page/user-deactivate-page'
import { useUserListPage } from '../web/user/page/user-list-page'
import { useUserRegisterPage } from '../web/user/page/user-register-page'
import { useUserUpdatePage } from '../web/user/page/user-update-page'
import { useUserAuthPage } from '../web/user-auth/page/user-auth-page'
import { useUserPasswordPage } from '../web/user-auth/page/user-password-page'
import { inDev } from '../_util/env2'
import { useTestPage } from '../web/_common/test-page'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '../oman/oman'

async function main() {
  const configPath = process.argv[2]

  omanNewSession(configPath)

  const web = await omanGetObject('Express2') as Express2
  web.logError = inDev()

  await useImageListApi()
  await useImageDetailApi()
  await useImageUploadApi()
  await useImageUpdateApi()
  await useImageDeleteApi()

  await useUserAuthApi()
  await useUserRegisterApi()
  await useUserDetailApi()
  await useUserUpdateApi()
  await useUserDeactivateApi()
  await useUserListApi()
  await useUserPasswordApi()

  await useCounterApi()
  await useBannerApi()

  await useSpaInitApi()

  await useImageListPage()
  await useImageDetailPage()
  await useImageUpdatePage()
  await useImageUploadPage()
  await useUserProfilePage()

  await useUserAuthPage()
  await useUserPasswordPage()
  await useUserDeactivatePage()
  await useUserListPage()
  await useUserRegisterPage()
  await useUserUpdatePage()

  await useCounterPage()
  await useBannerPage()
  await useAboutPage()

  await useTestPage()

  await useRedirect()

  async function closeAll() {
    await omanCloseAllObjects()
  }

  process.on('uncaughtException', function (err) {
    console.error(err.stack)
    process.exit(1)
  })

  process.on('SIGINT', function () {
    console.log('')
    console.log('SIGINT caught.')
    closeAll().finally(() => {
      console.log('Closed All.')
      process.exit(1)
    })
  })

  web.start().then(() => {
    const config = omanGetConfig()
    //console.log(config)
    console.log('server started.')
    console.log('http://localhost:' + config.port)
    console.log(config.mainUrl)
  })
}

main().catch(err => {
  logError(err)
})

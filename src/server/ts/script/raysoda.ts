import { useUserDeactivatePage } from '@server/web/user/page/user-deactivate-page'
import { useUserUpdateApi } from '@server/web/user/api/user-update-api'
import { useBannerApi } from '@server/web/banner/api/banner-api'
import { useUserPasswordPage } from '@server/web/user-auth/page/user-password-page'
import { useCounterPage } from '@server/web/counter/page/counter-page'
import { useUserPasswordApi } from '@server/web/user-auth/api/user-password-api'
import { useAboutPage } from '@server/web/about/page/about-page'
import { useUserProfilePage } from '@server/web/user-profile/profile-page'
import { inDev } from '@common/util/env2'
import { useUserListPage } from '@server/web/user/page/user-list-page'
import { useImageListApi } from '@server/web/image/api/image-list-api'
import { useImageUpdateApi } from '@server/web/image/api/image-update-api'
import { useImageUploadPage } from '@server/web/image/page/image-upload-page'
import { Express2 } from '@server/web/_express/express2'
import { useUserAuthPage } from '@server/web/user-auth/page/user-auth-page'
import { useUserListApi } from '@server/web/user/api/user-list-api'
import { useSpaInitApi } from '@server/web/_common/spa-init-api'
import { useImageDetailPage } from '@server/web/image/page/image-detail-page'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useRedirect } from '@server/web/redirect/redirect'
import { useUserUpdatePage } from '@server/web/user/page/user-update-page'
import { useImageUpdatePage } from '@server/web/image/page/image-update-page'
import { useImageDeleteApi } from '@server/web/image/api/image-delete-api'
import { useUserRegisterPage } from '@server/web/user/page/user-register-page'
import { useTestPage } from '@server/web/_common/test-page'
import { useUserDeactivateApi } from '@server/web/user/api/user-deactivate-api'
import { useUserAuthApi } from '@server/web/user-auth/api/user-auth-api'
import { useImageDetailApi } from '@server/web/image/api/image-detail-api'
import { logError } from '@common/util/error2'
import { useUserRegisterApi } from '@server/web/user/api/user-register-api'
import { useUserDetailApi } from '@server/web/user/api/user-detail-api'
import { useImageUploadApi } from '@server/web/image/api/image-upload-api'
import { useBannerPage } from '@server/web/banner/page/banner-page'
import { useImageListPage } from '@server/web/image/page/image-list-page'
import { useCounterApi } from '@server/web/counter/api/counter-api'

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

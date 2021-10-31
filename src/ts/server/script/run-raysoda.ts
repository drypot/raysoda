import { useUserDeactivatePage } from '@server/domain/user/page/user-deactivate-page'
import { useUserUpdateApi } from '@server/domain/user/api/user-update-api'
import { useBannerApi } from '@server/domain/banner/api/banner-api'
import { useUserPwResetPage } from '@server/domain/user/page/user-password-page'
import { useCounterPage } from '@server/domain/counter/page/counter-page'
import { useUserPasswordApi } from '@server/domain/user/api/user-password-api'
import { useAboutPage } from '@server/domain/about/page/about-page'
import { useUserProfilePage } from '@server/domain/user-profile/profile-page'
import { inDev } from '@common/util/env2'
import { useUserListPage } from '@server/domain/user/page/user-list-page'
import { useImageListApi } from '@server/domain/image/api/image-list-api'
import { useImageUpdateApi } from '@server/domain/image/api/image-update-api'
import { useImageUploadPage } from '@server/domain/image/page/image-upload-page'
import { Express2 } from '@server/express/express2'
import { useUserAuthPage } from '@server/domain/user/page/user-auth-page'
import { useUserListApi } from '@server/domain/user/api/user-list-api'
import { useSpaInitApi } from '@server/domain/spa/spa-init-api'
import { useImageDetailPage } from '@server/domain/image/page/image-detail-page'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useRedirect } from '@server/domain/redirect/redirect'
import { useUserUpdatePage } from '@server/domain/user/page/user-update-page'
import { useImageUpdatePage } from '@server/domain/image/page/image-update-page'
import { useImageDeleteApi } from '@server/domain/image/api/image-delete-api'
import { useUserRegisterPage } from '@server/domain/user/page/user-register-page'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { useImageDetailApi } from '@server/domain/image/api/image-detail-api'
import { logError } from '@common/util/error2'
import { useUserRegisterApi } from '@server/domain/user/api/user-register-api'
import { useUserDetailApi } from '@server/domain/user/api/user-detail-api'
import { useImageUploadApi } from '@server/domain/image/api/image-upload-api'
import { useBannerPage } from '@server/domain/banner/page/banner-page'
import { useImageListPage } from '@server/domain/image/page/image-list-page'
import { useCounterApi } from '@server/domain/counter/api/counter-api'
import { useSamplePage } from '@server/domain/_sample/page/sample-page'

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
  await useUserPwResetPage()
  await useUserDeactivatePage()
  await useUserListPage()
  await useUserRegisterPage()
  await useUserUpdatePage()

  await useCounterPage()
  await useBannerPage()
  await useAboutPage()

  await useRedirect()

  if (inDev()) {
    await useSamplePage()
  }

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

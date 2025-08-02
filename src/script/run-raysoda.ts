import { useUserDeactivatePage } from '../domain/user/page/user-deactivate-page.js'
import { useUserUpdateApi } from '../domain/user/api/user-update-api.js'
import { useBannerApi } from '../domain/banner/api/banner-api.js'
import { useUserPwResetPage } from '../domain/user/page/user-password-page.js'
import { useCounterPage } from '../domain/counter/page/counter-page.js'
import { useUserPasswordApi } from '../domain/user/api/user-password-api.js'
import { useAboutPage } from '../domain/about/page/about-page.js'
import { useUserHomePage } from '../domain/user-home/page/user-home-page.js'
import { inDev } from '../common/util/env2.js'
import { useUserListPage } from '../domain/user/page/user-list-page.js'
import { useImageListApi } from '../domain/image/api/image-list-api.js'
import { useImageUpdateApi } from '../domain/image/api/image-update-api.js'
import { useImageUploadPage } from '../domain/image/page/image-upload-page.js'
import { getExpress2 } from '../express/express2.js'
import { useUserAuthPage } from '../domain/user/page/user-auth-page.js'
import { useUserListApi } from '../domain/user/api/user-list-api.js'
import { useSpaInitApi } from '../domain/spa/spa-init-api.js'
import { useImageDetailPage } from '../domain/image/page/image-detail-page.js'
import { closeAllObjects, getConfig, initObjectContext } from '../oman/oman.js'
import { useRedirect } from '../domain/redirect/redirect.js'
import { useUserUpdatePage } from '../domain/user/page/user-update-page.js'
import { useImageUpdatePage } from '../domain/image/page/image-update-page.js'
import { useImageDeleteApi } from '../domain/image/api/image-delete-api.js'
import { useUserRegisterPage } from '../domain/user/page/user-register-page.js'
import { useUserAuthApi } from '../domain/user/api/user-auth-api.js'
import { useImageDetailApi } from '../domain/image/api/image-detail-api.js'
import { logError } from '../common/util/error2.js'
import { useUserRegisterApi } from '../domain/user/api/user-register-api.js'
import { useUserDetailApi } from '../domain/user/api/user-detail-api.js'
import { useImageUploadApi } from '../domain/image/api/image-upload-api.js'
import { useBannerPage } from '../domain/banner/page/banner-page.js'
import { useImageListPage } from '../domain/image/page/image-list-page.js'
import { useCounterApi } from '../domain/counter/api/counter-api.js'
import { useSamplePage } from '../domain/sample/page/sample-page.js'

async function main() {
  const configPath = process.argv[2]

  initObjectContext(configPath)

  const express2 = await getExpress2()
  express2.logError = inDev()

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
  await useUserHomePage()

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

  await useSamplePage()

  async function closeAll() {
    await closeAllObjects()
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

  express2.start().then(() => {
    const config = getConfig()
    //console.log(config)
    console.log('server started.')
    console.log('http://localhost:' + config.port)
    console.log(config.mainUrl)
  })
}

main().catch(err => {
  logError(err)
})

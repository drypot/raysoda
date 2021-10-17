import { Express2 } from '@server/web/_express/express2'
import { INVALID_DATA } from '@common/type/error-const'
import { omanGetObject } from '@server/oman/oman'
import { inDev } from '@common/util/env2'

export async function useTestPage() {

  const web = await omanGetObject('Express2') as Express2

  if (inDev()) {
    web.router.get('/error', function (req, res) {
      throw new Error()
    })

    web.router.get('/invalid-data', function (req, res) {
      throw INVALID_DATA
    })
  }

}

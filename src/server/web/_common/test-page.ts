import { Express2 } from '../_express/express2'
import { inDev } from '../../_util/env2'
import { INVALID_DATA } from '../../_type/error-const'
import { omanGetObject } from '../../oman/oman'

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

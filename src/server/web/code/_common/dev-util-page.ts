import { Express2 } from '../../_express/express2'
import { INVALID_DATA } from '../../../_type/error'
import { inDev } from '../../../_util/env2'

export function registerDevUtilPage(web: Express2) {

  if (inDev()) {
    web.router.get('/error', function (req, res) {
      throw new Error()
    })

    web.router.get('/invalid-data', function (req, res) {
      throw INVALID_DATA
    })
  }

}

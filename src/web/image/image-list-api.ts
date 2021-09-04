import { Express2, toCallback } from '../_express/express2.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { limitNumber } from '../../lib/base/number2.js'
import { ImageHead, imageListByCdateService, imageListService } from '../../service/image/image-list-service.js'

export function registerImageListApi(web: Express2, udb: UserDB, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/api/image', toCallback(async (req, res) => {
    const p = limitNumber(parseInt(req.query.p as string) || 1, 1, NaN)
    const ps = limitNumber(parseInt(req.query.ps as string) || 16, 1, 128)
    const d = req.query.d as string
    let list: ImageHead[]
    if (d) {
      const d2 = new Date(parseInt(d.slice(0, 4)), parseInt(d.slice(4, 6)))
      list = await imageListByCdateService(udb, idb, ifm, p, ps, d2)
    } else {
      list = await imageListService(udb, idb, ifm, p, ps)
    }
    res.json({
      list: list
    })
  }))

}

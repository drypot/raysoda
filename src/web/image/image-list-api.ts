import { Express2, toCallback } from '../_express/express2.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { limitNumber, numberFrom } from '../../_util/primitive.js'
import { imageListByCdateService, imageListService } from '../../service/image/image-list-service.js'
import { ImageListItem } from '../../core/image-view.js'

export function registerImageListApi(web: Express2, udb: UserDB, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/api/image-list', toCallback(async (req, res) => {
    const p = limitNumber(numberFrom(req.query.p as string, 1), 1, NaN)
    const ps = limitNumber(numberFrom(req.query.ps as string, 16), 1, 128)
    const dts = Date.parse(req.query.d as string)
    const d = isNaN(dts) ? null : new Date(dts)
    let list: ImageListItem[]
    if (d) {
      list = await imageListByCdateService(udb, idb, ifm, p, ps, d)
    } else {
      list = await imageListService(udb, idb, ifm, p, ps)
    }
    res.json({
      list: list
    })
  }))

}

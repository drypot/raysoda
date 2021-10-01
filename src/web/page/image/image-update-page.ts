import { Express2, toCallback } from '../../_express/express2.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { loginUserFrom } from '../../api/user-login/login-api.js'
import { checkImageUpdatable } from '../../../service/image/image-update-service.js'
import { paramToNumber } from '../../../_util/param.js'
import { NOT_AUTHENTICATED } from '../../../_type/error-user.js'
import { ErrorConst } from '../../../_type/error.js'

export function registerImageUpdatePage(web: Express2, udb: UserDB, idb: ImageDB) {

  web.router.get('/image-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = loginUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = paramToNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await idb.findImage(id)
    await checkImageUpdatable(user, image, err)
    if (err.length) throw err
    res.render('image/image-update', {
      image
    })
  }))

}

import { Express2, toCallback } from '../../_express/express2.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { newNumber } from '../../../_util/primitive.js'
import { ErrorConst } from '../../../_type/error.js'
import { imageUpdateGetService } from '../../../service/image/image-update-service.js'
import { getSessionUser, shouldBeUser } from '../../api/user-login/login-api.js'

export function registerImageUpdatePage(web: Express2, udb: UserDB, idb: ImageDB) {

  web.router.get('/image-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await imageUpdateGetService(idb, user, id, err)
    if (err.length) throw err
    res.render('image/image-update', {
      image
    })
  }))

}

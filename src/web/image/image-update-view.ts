import { Express2, toCallback } from '../_express/express2.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { NOT_AUTHENTICATED } from '../../service/user/form/user-form.js'
import { sessionUserFrom } from '../user/user-login-api.js'
import { Error2 } from '../../lib/base/error2.js'
import { checkImageUpdatable } from '../../service/image/image-update-service.js'
import { numberFrom } from '../../lib/base/primitive.js'

export function registerImageUpdateView(web: Express2, udb: UserDB, idb: ImageDB) {

  web.router.get('/image/:id([0-9]+)/update', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = numberFrom(req.params.id)
    const err: Error2[] = []
    const image = await idb.findImage(id)
    await checkImageUpdatable(user, image, err)
    if (err.length) throw err
    res.render('image/pug/image-update', {
      image
    })
  }))

}

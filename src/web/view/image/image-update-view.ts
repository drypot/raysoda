import { Express2, toCallback } from '../../_express/express2.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { NOT_AUTHENTICATED } from '../../../service/user/form/user-form.js'
import { sessionUserFrom } from '../../api/user/user-login-api.js'
import { Error2 } from '../../../lib/base/error2.js'
import { checkImageUpdatable } from '../../../service/image/image-update-service.js'

export function registerImageUpdateView(web: Express2, udb: UserDB, idb: ImageDB) {

  web.router.get('/image/:id([0-9]+)/update', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = parseInt(req.params.id) || 0
    const err: Error2[] = []
    const image = await idb.findImage(id)
    await checkImageUpdatable(image, user, err)
    if (err.length) throw err
    res.render('image/image-update-view', {
      image
    })
  }))

}

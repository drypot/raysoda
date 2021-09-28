import { Express2, toCallback } from '../_express/express2.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { leftTicket } from '../../service/image/image-upload-service.js'
import { sessionUserFrom } from '../user/user-login-api.js'
import { NOT_AUTHENTICATED } from '../../_error/error-user.js'

export function registerImageUploadPage(web: Express2, udb: UserDB, idb: ImageDB) {

  web.router.get('/image-upload', toCallback(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const { ticket, hour } = await leftTicket(idb, user.id, new Date())
    res.render('image/pug/image-upload', {
      ticketMax: idb.config.ticketMax,
      ticket,
      hour
    })
  }))

}

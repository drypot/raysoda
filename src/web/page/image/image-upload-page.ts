import { Express2, toCallback } from '../../_express/express2.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { leftTicket } from '../../../service/image/image-upload-service.js'
import { getSessionUser, shouldBeUser } from '../../api/user-login/login-api.js'
import { renderHtml } from '../_common/render-html.js'

export function registerImageUploadPage(web: Express2, idb: ImageDB) {

  web.router.get('/image-upload', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const { ticket, hour } = await leftTicket(idb, user.id, new Date())
    renderHtml(res, 'image/image-upload', {
      ticketMax: idb.config.ticketMax,
      ticket,
      hour
    })
  }))

}

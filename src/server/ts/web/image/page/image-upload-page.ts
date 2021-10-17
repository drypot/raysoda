import { leftTicket } from '@server/service/image/image-upload-service'
import { Express2, toCallback } from '@server/web/_express/express2'
import { getSessionUser } from '@server/web/user-auth/api/user-auth-api'
import { renderHtml } from '@server/web/_common/render-html'
import { ImageDB } from '@server/db/image/image-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { shouldBeUser } from '@server/service/user-auth/user-auth-service'

export async function useImageUploadPage() {

  const config = omanGetConfig()
  const web = await omanGetObject('Express2') as Express2
  const idb = await omanGetObject('ImageDB') as ImageDB

  web.router.get('/image-upload', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const { ticket, hour } = await leftTicket(idb, user.id, new Date())
    renderHtml(res, 'image/image-upload', {
      ticketMax: config.ticketMax,
      ticket,
      hour
    })
  }))

}

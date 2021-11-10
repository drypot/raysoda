import { imageGetLeftTicket } from '@server/domain/image/_service/image-upload'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { renderHtml } from '@server/express/respose'
import { ImageDB } from '@server/db/image/image-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { userAssertLogin } from '@server/domain/user/_service/user-auth'

export async function useImageUploadPage() {

  const config = omanGetConfig()
  const web = await omanGetObject('Express2') as Express2
  const idb = await omanGetObject('ImageDB') as ImageDB

  web.router.get('/image-upload', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    const { ticket, hour } = await imageGetLeftTicket(idb, user.id, new Date())
    renderHtml(res, 'image/image-upload', {
      ticketMax: config.ticketMax,
      ticket,
      hour
    })
  }))

}

import { getLeftTicket } from '@server/domain/image/_service/image-upload'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { renderHtml } from '@server/express/response'
import { ImageDB } from '@server/db/image/image-db'
import { getConfig, getObject } from '@server/oman/oman'
import { assertLoggedIn } from '@server/domain/user/_service/user-auth'

export async function useImageUploadPage() {

  const config = getConfig()
  const web = await getObject('Express2') as Express2
  const idb = await getObject('ImageDB') as ImageDB

  web.router.get('/image-upload', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    const { ticket, hour } = await getLeftTicket(idb, user.id, new Date())
    renderHtml(res, 'image/image-upload', {
      ticketMax: config.ticketMax,
      ticket,
      hour
    })
  }))

}

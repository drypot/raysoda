import { getExpress2, toCallback } from '../../../express/express2.js'
import { getConfig } from '../../../oman/oman.js'
import { getImageDB } from '../../../db/image/image-db.js'
import { userGetSessionUser } from '../../user/api/user-auth-api.js'
import { assertLoggedIn } from '../../user/service/user-auth.js'
import { getLeftTicket } from '../service/image-upload.js'
import { renderHtml } from '../../../express/response.js'

export async function useImageUploadPage() {

  const config = getConfig()
  const express2 = await getExpress2()
  const idb = await getImageDB()

  express2.router.get('/image-upload', toCallback(async (req, res) => {
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

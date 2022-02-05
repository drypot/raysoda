import { ErrorConst } from '@common/type/error'
import { Express2, toCallback } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { renderHtml } from '@server/express/response'
import { ImageDB } from '@server/db/image/image-db'
import { newNumber } from '@common/util/primitive'
import { getObject } from '@server/oman/oman'
import { assertLoggedIn } from '@server/domain/user/_service/user-auth'
import { getImageForUpdate } from '@server/domain/image/_service/image-update'

export async function useImageUpdatePage() {

  const web = await getObject('Express2') as Express2
  const idb = await getObject('ImageDB') as ImageDB

  web.router.get('/image-update/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await getImageForUpdate(idb, user, id, err)
    if (err.length) throw err
    renderHtml(res, 'image/image-update', { form: { image } })
  }))

}

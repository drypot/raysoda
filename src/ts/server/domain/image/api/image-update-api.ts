import { newNumber, newString } from '@common/util/primitive'
import { Express2, toCallback } from '@server/express/express2'
import { UpdateImageForm } from '@common/type/image-form'
import { deleteUpload, Uploader } from '@server/express/uploader'
import { ErrorConst } from '@common/type/error'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { omanGetImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { assertLoggedIn } from '@server/domain/user/_service/user-auth'
import { getImageForUpdate, updateImage } from '@server/domain/image/_service/image-update'
import { renderJson } from '@server/express/response'

export async function useImageUpdateApi() {

  const web = await omanGetObject('Express2') as Express2
  const uploader = await omanGetObject('Uploader') as Uploader
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.get('/api/image-update-get/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await getImageForUpdate(idb, user, id, err)
    if (err.length) throw err

    renderJson(res, { image })
  }))

  web.router.put('/api/image-update', uploader.single('file'), deleteUpload(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const form: UpdateImageForm = {
      id: newNumber(req.body.id),
      comment: newString(req.body.comment),
    }
    const file = newString(req.file?.path)
    const err: ErrorConst[] = []
    await updateImage(idb, ifm, user, form, file, err)
    if (err.length) throw err

    renderJson(res, {})
  }))

}


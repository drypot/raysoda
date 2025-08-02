import { getExpress2, toCallback } from '../../../express/express2.js'
import { deleteUpload, getUploader } from '../../../express/uploader.js'
import { getImageDB } from '../../../db/image/image-db.js'
import { getImageFileManager } from '../../../fileman/fileman-loader.js'
import { getConfig } from '../../../oman/oman.js'
import { userGetSessionUser } from '../../user/api/user-auth-api.js'
import { assertLoggedIn } from '../../user/service/user-auth.js'
import { newNumber, newString } from '../../../common/util/primitive.js'
import { ErrorConst } from '../../../common/type/error.js'
import { getImageForUpdate, updateImage } from '../service/image-update.js'
import { renderJson } from '../../../express/response.js'
import { UpdateImageForm } from '../../../common/type/image-form.js'

export async function useImageUpdateApi() {

  const express2 = await getExpress2()
  const uploader = await getUploader()
  const idb = await getImageDB()
  const ifm = await getImageFileManager(getConfig().appNamel)

  express2.router.get('/api/image-update-get/:id', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await getImageForUpdate(idb, user, id, err)
    if (err.length) throw err

    renderJson(res, { image })
  }))

  express2.router.put('/api/image-update', uploader.single('file'), deleteUpload(async (req, res) => {
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


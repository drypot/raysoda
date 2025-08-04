import { getExpress2, toCallback } from '../../../express/express2.ts'
import { deleteUpload, getUploader } from '../../../express/uploader.ts'
import { getImageDB } from '../../../db/image/image-db.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { getConfig } from '../../../oman/oman.ts'
import { userGetSessionUser } from '../../user/api/user-auth-api.ts'
import { assertLoggedIn } from '../../user/service/user-auth.ts'
import { newNumber, newString } from '../../../common/util/primitive.ts'
import type { ErrorConst } from '../../../common/type/error.ts'
import { getImageForUpdate, updateImage } from '../service/image-update.ts'
import { renderJson } from '../../../express/response.ts'
import type { UpdateImageForm } from '../../../common/type/image-form.ts'

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


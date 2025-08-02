import { getExpress2 } from '../../../express/express2.js'
import { deleteUpload, getUploader } from '../../../express/uploader.js'
import { getUserDB } from '../../../db/user/user-db.js'
import { getImageDB } from '../../../db/image/image-db.js'
import { getImageFileManager } from '../../../fileman/fileman-loader.js'
import { getConfig } from '../../../oman/oman.js'
import { userGetSessionUser } from '../../user/api/user-auth-api.js'
import { assertLoggedIn } from '../../user/service/user-auth.js'
import { UploadImageForm } from '../../../common/type/image-form.js'
import { newString } from '../../../common/util/primitive.js'
import { ErrorConst } from '../../../common/type/error.js'
import { uploadImage } from '../service/image-upload.js'
import { renderJson } from '../../../express/response.js'

export async function useImageUploadApi() {

  const express2 = await getExpress2()
  const uploader = await getUploader()
  const udb = await getUserDB()
  const idb = await getImageDB()
  const ifm = await getImageFileManager(getConfig().appNamel)

  express2.router.post('/api/image-upload', uploader.single('file'), deleteUpload(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const form: UploadImageForm = {
      comment: newString(req.body?.comment),
    }
    const file = newString(req.file?.path)
    const err: ErrorConst[] = []
    const id = await uploadImage(udb, idb, ifm, user, form, file, err)
    if (err.length) throw err

    renderJson(res, { id })
  }))

}



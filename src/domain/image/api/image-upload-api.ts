import { getExpress2 } from '../../../express/express2.ts'
import { deleteUpload, getUploader } from '../../../express/uploader.ts'
import { getUserDB } from '../../../db/user/user-db.ts'
import { getImageDB } from '../../../db/image/image-db.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { getConfig } from '../../../oman/oman.ts'
import { userGetSessionUser } from '../../user/api/user-auth-api.ts'
import { assertLoggedIn } from '../../user/service/user-auth.ts'
import type { UploadImageForm } from '../../../common/type/image-form.ts'
import { newString } from '../../../common/util/primitive.ts'
import type { ErrorConst } from '../../../common/type/error.ts'
import { uploadImage } from '../service/image-upload.ts'
import { renderJson } from '../../../express/response.ts'

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



import { deleteUpload, Uploader } from '@server/express/uploader'
import { ErrorConst } from '@common/type/error'
import { Express2 } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { getImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { getConfig, getObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { uploadImage } from '@server/domain/image/_service/image-upload'
import { assertLoggedIn } from '@server/domain/user/_service/user-auth'
import { newString } from '@common/util/primitive'
import { UploadImageForm } from '@common/type/image-form'
import { renderJson } from '@server/express/response'

export async function useImageUploadApi() {

  const web = await getObject('Express2') as Express2
  const uploader = await getObject('Uploader') as Uploader
  const udb = await getObject('UserDB') as UserDB
  const idb = await getObject('ImageDB') as ImageDB
  const ifm = await getImageFileManager(getConfig().appNamel)

  web.router.post('/api/image-upload', uploader.single('file'), deleteUpload(async (req, res) => {
    const user = userGetSessionUser(res)
    assertLoggedIn(user)

    const form: UploadImageForm = {
      comment: newString(req.body.comment),
    }
    const file = newString(req.file?.path)
    const err: ErrorConst[] = []
    const id = await uploadImage(udb, idb, ifm, user, form, file, err)
    if (err.length) throw err

    renderJson(res, { id })
  }))

}



import { deleteUpload, Uploader } from '@server/express/uploader'
import { ErrorConst } from '@common/type/error'
import { Express2 } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { omanGetImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { imageUpload } from '@server/domain/image/_service/image-upload'
import { userAssertLogin } from '@server/domain/user/_service/user-auth'
import { newString } from '@common/util/primitive'
import { ImageUploadForm } from '@common/type/image-form'
import { renderJson } from '@server/express/respose'

export async function useImageUploadApi() {

  const web = await omanGetObject('Express2') as Express2
  const uploader = await omanGetObject('Uploader') as Uploader
  const udb = await omanGetObject('UserDB') as UserDB
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.post('/api/image-upload', uploader.single('file'), deleteUpload(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)

    const form: ImageUploadForm = {
      comment: newString(req.body.comment),
    }
    const file = newString(req.file?.path)
    const err: ErrorConst[] = []
    const id = await imageUpload(udb, idb, ifm, user, form, file, err)
    if (err.length) throw err

    renderJson(res, { id })
  }))

}



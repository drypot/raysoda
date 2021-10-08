import { deleteUpload, Express2, renderJson } from '../../_express/express2.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageUploadForm } from '../../../_type/image-form.js'
import { imageUploadService } from '../../../service/image/image-upload-service.js'
import { Request } from 'express'
import { ImageFileManager } from '../../../file/fileman.js'
import { ErrorConst } from '../../../_type/error.js'
import { getSessionUser, shouldBeUser } from '../user-login/login-api.js'

function newImageUploadForm(req: Request) {
  return {
    now: new Date(),
    comment: req.body.comment || '',
    file: req.file?.path
  } as ImageUploadForm
}

export function registerImageUploadApi(web: Express2, udb: UserDB, idb: ImageDB, ifm: ImageFileManager) {

  web.router.post('/api/image-upload', web.upload.single('file'), deleteUpload(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const form = newImageUploadForm(req)
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, user.id, form, err)
    if (err.length) throw err
    renderJson(res, { id })
  }))

}

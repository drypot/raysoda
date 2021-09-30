import { deleteUpload, Express2 } from '../../_express/express2.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageUploadForm } from '../../../service/image/_image-service.js'
import { sessionUserFrom } from '../user-login/login-api.js'
import { imageUploadService } from '../../../service/image/image-upload-service.js'
import { Request } from 'express'
import { Error2 } from '../../../_util/error2.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { NOT_AUTHENTICATED } from '../../../_type/error-user.js'

function imageUploadFormFrom(req: Request) {
  return {
    now: new Date(),
    comment: req.body.comment || '',
    file: req.file?.path
  } as ImageUploadForm
}

export function registerImageUploadApi(web: Express2, udb: UserDB, idb: ImageDB, ifm: ImageFileManager) {

  web.router.post('/api/image-upload', web.upload.single('file'), deleteUpload(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const form = imageUploadFormFrom(req)
    const err: Error2[] = []
    const id = await imageUploadService(udb, idb, ifm, user.id, form, err)
    if (err.length) throw err
    res.json({ id })
  }))

}

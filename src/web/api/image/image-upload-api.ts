import { deleteUpload, Express2 } from '../../_express/express2.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageUploadForm } from '../../../service/image/form/image-form.js'
import { sessionUserFrom } from '../user/user-login-api.js'
import { NOT_AUTHENTICATED } from '../../../service/user/form/user-form.js'
import { imageUploadService } from '../../../service/image/image-upload-service.js'
import { Request } from 'express'
import { Error2 } from '../../../lib/base/error2.js'
import { ImageFileManager } from '../../../file/fileman.js'

function imageUploadFormFrom(req: Request) {
  return {
    now: new Date(),
    comment: req.body.comment || '',
    file: req.file?.path
  } as ImageUploadForm
}

export function registerImageUploadApi(web: Express2, udb: UserDB, idb: ImageDB, ifm: ImageFileManager) {

  web.router.post('/api/image', web.upload.single('file'), deleteUpload(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const form = imageUploadFormFrom(req)
    const err: Error2[] = []
    const id = await imageUploadService(udb, idb, ifm, user.id, form, err)
    if (err.length) throw err
    res.json({ id })
  }))

}

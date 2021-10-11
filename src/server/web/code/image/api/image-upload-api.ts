import { deleteUpload, Express2 } from '../../../_express/express2'
import { UserDB } from '../../../../db/user/user-db'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageUploadForm } from '../../../../_type/image-form'
import { imageUploadService } from '../../../../service/image/image-upload-service'
import { Request } from 'express'
import { ImageFileManager } from '../../../../file/fileman'
import { ErrorConst } from '../../../../_type/error'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { renderJson } from '../../_common/render-json'
import { shouldBeUser } from '../../../../service/user-auth/user-auth-service'

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

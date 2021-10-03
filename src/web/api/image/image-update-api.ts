import { deleteUpload, Express2 } from '../../_express/express2.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageUpdateForm } from '../../../_type/image-form.js'
import { Request } from 'express'
import { ImageFileManager } from '../../../file/fileman.js'
import { imageUpdateService } from '../../../service/image/image-update-service.js'
import { newNumber, newString } from '../../../_util/primitive.js'
import { ErrorConst } from '../../../_type/error.js'
import { getSessionUser, shouldBeUser } from '../user-login/login-api.js'

function newImageUpdateForm(req: Request): ImageUpdateForm {
  return {
    comment: newString(req.body.comment),
    file: req.file?.path
  }
}

export function registerImageUpdateApi(web: Express2, idb: ImageDB, ifm: ImageFileManager) {

  web.router.put('/api/image-update/:id([0-9]+)', web.upload.single('file'), deleteUpload(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const form = newImageUpdateForm(req)
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, user, id, form, err)
    if (err.length) throw err
    res.json({})
  }))

}

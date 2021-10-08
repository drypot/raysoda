import { deleteUpload, Express2, renderJson, toCallback } from '../../_express/express2.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageUpdateForm } from '../../../_type/image-form.js'
import { Request } from 'express'
import { ImageFileManager } from '../../../file/fileman.js'
import { imageUpdateGetService, imageUpdateService } from '../../../service/image/image-update-service.js'
import { newNumber, newString } from '../../../_util/primitive.js'
import { ErrorConst } from '../../../_type/error.js'
import { getSessionUser, shouldBeUser } from '../user-login/login-api.js'

export function registerImageUpdateApi(web: Express2, idb: ImageDB, ifm: ImageFileManager) {

  web.router.get('/api/image-update-get/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await imageUpdateGetService(idb, user, id, err)
    if (err.length) throw err
    renderJson(res, { image })
  }))

  web.router.put('/api/image-update/:id([0-9]+)', web.upload.single('file'), deleteUpload(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const form = newUpdateForm(req)
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, user, id, form, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}

function newUpdateForm(req: Request): ImageUpdateForm {
  return {
    comment: newString(req.body.comment),
    file: req.file?.path
  }
}


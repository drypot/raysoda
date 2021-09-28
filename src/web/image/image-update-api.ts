import { deleteUpload, Express2 } from '../_express/express2.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageUpdateForm } from '../../service/image/_image-service.js'
import { sessionUserFrom } from '../user/user-login-api.js'
import { Request } from 'express'
import { Error2 } from '../../_error/error2.js'
import { ImageFileManager } from '../../file/fileman.js'
import { checkImageUpdatable, imageUpdateService } from '../../service/image/image-update-service.js'
import { numberFrom } from '../../_util/primitive.js'
import { NOT_AUTHENTICATED } from '../../_error/error-user.js'

function imageUpdateFormFrom(req: Request) {
  return {
    comment: req.body.comment || '',
    file: req.file?.path
  } as ImageUpdateForm
}

export function registerImageUpdateApi(web: Express2, idb: ImageDB, ifm: ImageFileManager) {

  web.router.put('/api/image-update/:id([0-9]+)', web.upload.single('file'), deleteUpload(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = numberFrom(req.params.id)
    const form = imageUpdateFormFrom(req)
    const err: Error2[] = []
    const image = await idb.findImage(id)
    await checkImageUpdatable(user, image, err)
    if (err.length) throw err
    await imageUpdateService(idb, ifm, id, form, err)
    if (err.length) throw err
    res.json({})
  }))

}
